// routes/public.js

import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Service from "../models/Services.js";

const router = express.Router();
const SALT_ROUNDS = 12;

// Registration
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, houseNumber, street, state, country } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !houseNumber ||
      !street ||
      !state ||
      !country
    )
      return res.status(400).json({
        success: false,
        error: "All field are required",
      });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      houseNumber,
      street,
      state,
      country,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successfull. Please log in.",
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        error: "Email and password required",
      });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({
        success: false,
        error: "Invalid Credential",
      });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({
        success: false,
        error: "Invalid Credentials",
      });

    req.session.userId = user._id;
    req.session.userRole = user.role;

    return res.status(200).json({
      success: true,
      message: "Logged in",
      user: {
        id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post("/logout", (req, res, next) => {
  if (!req.session)
    return res.status(200).json({
      success: true,
      message: "logged out",
    });

  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("connect.sid");
    return res.json({ message: "logged out" });
  });
});

// Services
router.get("/service", async (req, res, next) => {
  try {
    const service = await Service.find().sort({ createdAt: -1 });
    return res.status(200).json({ service });
  } catch (error) {
    next(error);
  }
});

// company info endpoint
router.get("/info", (req, res) => {
  return res.json({
    company: "Lawman Nigeria PSP",
    description: "Environmental Waste Management Service Provider",
    contact: {
      email: "support@lawmanigeria.com",
      phone: "+234-816-945-3274",
    },
    message:
      "Welcome to our public API. View our services or register to make payments.",
  });
});

export default router;
