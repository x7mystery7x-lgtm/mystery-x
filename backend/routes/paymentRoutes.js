import express from "express";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { ensureAuthenticated, ensureRole } from "../middleware/auth.js";

const router = express.Router();
const MONTHLY_FEE = 5000;

// ===== CLIENT ROUTES =====

// USER: Create mock payment (POST /me/payments/mock-pay)
router.post(
  "/me/payments/mock-pay",
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      const { month, year, addressUuid, amount, notes } = req.body;

      if (!month || !year || !addressUuid) {
        return res.status(400).json({
          success: false,
          error: "month, year, and addressUuid are required",
        });
      }

      // Validate month is between 1-12
      if (month < 1 || month > 12) {
        return res.status(400).json({
          success: false,
          error: "Month must be between 1 and 12",
        });
      }

      // Check if payment already exists for this month/year
      const existingPayment = await Payment.findOne({
        userId: req.session.userId,
        month,
        year,
      });

      if (existingPayment) {
        return res.status(409).json({
          success: false,
          error: "Payment already exists for this month and year",
        });
      }

      const payment = await Payment.create({
        userId: req.session.userId,
        addressUuid,
        month,
        year,
        amount: amount || MONTHLY_FEE,
        status: "paid",
        paymentDate: new Date(),
        notes: notes || null,
      });

      return res.status(201).json({
        success: true,
        message: "Payment recorded successfully",
        payment,
      });
    } catch (error) {
      next(error);
    }
  }
);

// USER: Get own payment history (GET /me/payments)
router.get("/me/payments", ensureAuthenticated, async (req, res, next) => {
  try {
    const { month, year, status } = req.query;

    // Build filter
    const filter = { userId: req.session.userId };

    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    if (status) filter.status = status;

    const payments = await Payment.find(filter).sort({ year: -1, month: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
});

// USER: Get specific payment (GET /me/payments/:id)
router.get("/me/payments/:id", ensureAuthenticated, async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.session.userId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    return res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
});

// ===== ADMIN ROUTES =====

// ADMIN: Create payment for themselves (POST /admin/payments/me)
router.post("/admin/payments/me", ensureRole("admin"), async (req, res, next) => {
  try {
    const { amount, description } = req.body;

    if (!amount || !description) {
      return res.status(400).json({
        success: false,
        error: "Amount and description are required",
      });
    }

    // Get admin user
    const admin = await User.findById(req.session.userId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin user not found",
      });
    }

    const payment = await Payment.create({
      userId: req.session.userId,
      amount: parseFloat(amount),
      notes: description, // Store description in notes field
      status: 'paid', // Admin payments are automatically marked as paid
      addressUuid: admin.account || 'ADMIN-' + Date.now(), // Use admin's account UUID or generate one
      month: new Date().getMonth() + 1, // Current month (1-12)
      year: new Date().getFullYear(), // Current year
    });

    return res.status(201).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Get admin's own payments (GET /admin/payments/me)
router.get("/admin/payments/me", ensureRole("admin"), async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.session.userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Get all payments with filtering (GET /admin/payments)
router.get("/admin/payments", ensureRole("admin"), async (req, res, next) => {
  try {
    const { month, year, uuid, email, status } = req.query;

    // Build filter
    const filter = {};

    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    if (uuid) filter.addressUuid = uuid;
    if (status) filter.status = status;

    let query = Payment.find(filter).populate("userId", "name email");

    // If filtering by email, we need to populate and filter differently
    if (email) {
      const users = await User.find({
        email: { $regex: email, $options: "i" },
      }).select("_id");
      const userIds = users.map((u) => u._id);
      filter.userId = { $in: userIds };
      query = Payment.find(filter).populate("userId", "name email");
    }

    const payments = await query.sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Get payment by ID (GET /admin/payments/:id)
router.get(
  "/admin/payments/:id",
  ensureRole("admin"),
  async (req, res, next) => {
    try {
      const payment = await Payment.findById(req.params.id).populate(
        "userId",
        "name email account"
      );

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: "Payment not found",
        });
      }

      return res.status(200).json({ success: true, payment });
    } catch (error) {
      next(error);
    }
  }
);

// ADMIN: Update payment status (PATCH /admin/payments/:id)
router.patch(
  "/admin/payments/:id",
  ensureRole("admin"),
  async (req, res, next) => {
    try {
      const { status, notes } = req.body;

      if (status && !["paid", "unpaid", "overdue"].includes(status)) {
        return res.status(400).json({
          success: false,
          error: "Status must be 'paid', 'unpaid', or 'overdue'",
        });
      }

      const updateData = {};
      if (status) {
        updateData.status = status;
        updateData.paymentDate = status === "paid" ? new Date() : null;
      }
      if (notes !== undefined) updateData.notes = notes;

      const payment = await Payment.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).populate("userId", "name email");

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: "Payment not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment updated successfully",
        payment,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ADMIN: Delete payment (DELETE /admin/payments/:id)
router.delete(
  "/admin/payments/:id",
  ensureRole("admin"),
  async (req, res, next) => {
    try {
      const payment = await Payment.findByIdAndDelete(req.params.id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: "Payment not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
