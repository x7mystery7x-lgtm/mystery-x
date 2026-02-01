import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./backend/models/User.js";
import bcrypt from "bcrypt";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL_ATLAS);
    const exists = await User.findOne({ email: "admin-account@gmail.com" });
    if (exists) {
      console.log("Admin account already exists");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "System Admin",
      email: "admin-account@gmail.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      houseNumber: "A1",
      street: "Main Street",
      state: "Republic City of Ba'sing Se",
      country: "Earth Kingdom",
    });

    await admin.save();
    console.log("Admin account created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
