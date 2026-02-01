import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Address from "../models/Address.js";
import { ensureAuthenticated, ensureOwnerOrAdmin } from "../middleware/auth.js";

const router = express.Router();
const SALT_ROUNDS = 12;

// All routes under this router requires login
router.use(ensureAuthenticated);

// GET own profile (GET /me)
router.get("/me", async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

// Get specific profile by ID (only owner or admin)
router.get("/profile/:id", ensureOwnerOrAdmin, async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).select("-password");
    if (!u) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ user: u });
  } catch (error) {
    next(error);
  }
});

// Update profile (name only) - only owner or admin (PATCH /me/profile)
router.patch("/me/profile", async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Name is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { name },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
});

// Update password (PATCH /me/password)
router.patch("/me/password", async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Delete profile (only owner or admin)
router.delete("/profile/:id", ensureOwnerOrAdmin, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // If deleting own account, destroy session
    if (
      req.session.userId &&
      req.session.userId.toString() === req.params.id.toString()
    ) {
      req.session.destroy(() => {});
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// ===== ADDRESS MANAGEMENT =====

// Create address (POST /me/address)
router.post("/me/address", async (req, res, next) => {
  try {
    const { houseNumber, street, state, country } = req.body;

    if (!houseNumber || !street || !state || !country) {
      return res.status(400).json({
        success: false,
        error: "houseNumber, street, state, and country are required",
      });
    }

    // Check if address already exists for this user
    const existingAddress = await Address.findOne({
      userId: req.session.userId,
    });
    if (existingAddress) {
      return res.status(409).json({
        success: false,
        error: "You already have an address. Use PATCH to update it.",
      });
    }

    const address = await Address.create({
      userId: req.session.userId,
      houseNumber,
      street,
      state,
      country,
    });

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      address,
    });
  } catch (error) {
    next(error);
  }
});

// Get user's address (GET /me/address)
router.get("/me/address", async (req, res, next) => {
  try {
    const address = await Address.findOne({ userId: req.session.userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    next(error);
  }
});

// Update address (PATCH /me/address)
router.patch("/me/address", async (req, res, next) => {
  try {
    const { houseNumber, street, state, country } = req.body;

    if (!houseNumber && !street && !state && !country) {
      return res.status(400).json({
        success: false,
        error: "At least one field is required to update",
      });
    }

    const updateData = {};
    if (houseNumber) updateData.houseNumber = houseNumber;
    if (street) updateData.street = street;
    if (state) updateData.state = state;
    if (country) updateData.country = country;

    const address = await Address.findOneAndUpdate(
      { userId: req.session.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        error: "Address not found. Create one first using POST /me/address",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    next(error);
  }
});

// Delete address (DELETE /me/address)
router.delete("/me/address", async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({
      userId: req.session.userId,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        error: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
