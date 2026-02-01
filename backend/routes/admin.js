import express from "express";
import User from "../models/User.js";
import { ensureRole } from "../middleware/auth.js";

const router = express.Router();

router.use(ensureRole("admin"));

// ===== CLIENT MANAGEMENT =====

// ADMIN: Get all clients with optional filtering (GET /admin/clients)
router.get("/clients", async (req, res, next) => {
  try {
    const { email, uuid, search } = req.query;

    // Build filter
    const filter = { role: "user" }; // Only get clients, not admins

    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }

    if (uuid) {
      filter.account = uuid; // account field stores UUID
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { account: { $regex: search, $options: "i" } },
      ];
    }

    const clients = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Get single client (GET /admin/clients/:id)
router.get("/clients/:id", async (req, res, next) => {
  try {
    const client = await User.findOne({
      _id: req.params.id,
      role: "user",
    }).select("-password");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Update client (limited fields) (PATCH /admin/clients/:id)
router.patch("/clients/:id", async (req, res, next) => {
  try {
    const { name, isVerified } = req.body;

    // Only allow updating name and isVerified status
    const updateData = {};
    if (name) updateData.name = name;
    if (isVerified !== undefined) updateData.isVerified = isVerified;

    const client = await User.findOneAndUpdate(
      { _id: req.params.id, role: "user" },
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Delete client (DELETE /admin/clients/:id)
router.delete("/clients/:id", async (req, res, next) => {
  try {
    const client = await User.findOneAndDelete({
      _id: req.params.id,
      role: "user",
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// ===== USERS MANAGEMENT (keeping existing endpoints) =====

// fetch all users (including admins)
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
});

// Get single user
router.get("/users/:id", async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).select("-password");
    if (!u)
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    return res.json({ user: u });
  } catch (error) {
    next(error);
  }
});

// Admin delete user
router.delete("/users/:id", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: "User removed" });
  } catch (error) {
    next(error);
  }
});

export default router;
