import express from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { ensureAuthenticated, ensureRole } from "../middleware/auth.js";

const router = express.Router();

// ===== CLIENT ROUTES =====

// CLIENT: Send message to admin (POST /me/messages)
router.post("/me/messages", ensureAuthenticated, async (req, res, next) => {
  try {
    const { subject, body } = req.body;

    if (!subject || !body) {
      return res.status(400).json({
        success: false,
        error: "subject and body are required",
      });
    }

    // Find admin user to send message to
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(500).json({
        success: false,
        error: "No admin found to send message to",
      });
    }

    const message = await Message.create({
      fromUserId: req.session.userId,
      toUserId: admin._id,
      subject,
      body,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

// CLIENT: Get own messages (GET /me/messages)
router.get("/me/messages", ensureAuthenticated, async (req, res, next) => {
  try {
    const { unreadOnly } = req.query;

    // Build filter
    const filter = {
      $or: [
        { toUserId: req.session.userId }, // Messages sent TO user
        { fromUserId: req.session.userId }, // Messages sent BY user
      ],
    };

    if (unreadOnly === "true") {
      filter.readAt = null;
    }

    const messages = await Message.find(filter)
      .populate("fromUserId", "name email role")
      .populate("toUserId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
});

// CLIENT: Mark message as read (PATCH /me/messages/:id/read)
router.patch(
  "/me/messages/:id/read",
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      const message = await Message.findOne({
        _id: req.params.id,
        toUserId: req.session.userId, // User can only mark their received messages as read
      });

      if (!message) {
        return res.status(404).json({
          success: false,
          error: "Message not found",
        });
      }

      message.readAt = new Date();
      await message.save();

      return res.status(200).json({
        success: true,
        message: "Message marked as read",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ===== ADMIN ROUTES =====

// ADMIN: Get admin's own messages (GET /admin/messages/me)
router.get("/admin/messages/me", ensureRole("admin"), async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { fromUserId: req.session.userId },
        { toUserId: req.session.userId }
      ]
    })
    .populate("fromUserId", "name email role")
    .populate("toUserId", "name email role")
    .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Get all messages with optional filtering (GET /admin/messages)
router.get("/admin/messages", ensureRole("admin"), async (req, res, next) => {
  try {
    const { userId, unreadOnly } = req.query;

    // Build filter
    const filter = {};

    if (userId) {
      filter.$or = [{ fromUserId: userId }, { toUserId: userId }];
    }

    if (unreadOnly === "true") {
      filter.readAt = null;
    }

    const messages = await Message.find(filter)
      .populate("fromUserId", "name email role")
      .populate("toUserId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Send message to client (POST /admin/messages)
router.post("/admin/messages", ensureRole("admin"), async (req, res, next) => {
  try {
    const { toUserId, subject, body } = req.body;

    if (!toUserId || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: "toUserId, subject, and body are required",
      });
    }

    // Verify recipient exists and is a client (not admin)
    const recipient = await User.findOne({
      _id: toUserId,
      role: "user",
    });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    // Get admin user ID from session
    const admin = await User.findOne({ role: "admin" });

    const message = await Message.create({
      fromUserId: admin._id,
      toUserId,
      subject,
      body,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

// ADMIN: Get message by ID (GET /admin/messages/:id)
router.get(
  "/admin/messages/:id",
  ensureRole("admin"),
  async (req, res, next) => {
    try {
      const message = await Message.findById(req.params.id)
        .populate("fromUserId", "name email role")
        .populate("toUserId", "name email role");

      if (!message) {
        return res.status(404).json({
          success: false,
          error: "Message not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ADMIN: Delete message (DELETE /admin/messages/:id)
router.delete(
  "/admin/messages/:id",
  ensureRole("admin"),
  async (req, res, next) => {
    try {
      const message = await Message.findByIdAndDelete(req.params.id);

      if (!message) {
        return res.status(404).json({
          success: false,
          error: "Message not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
