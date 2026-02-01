import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true, // One profile per user
      index: true,
    },

    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      paymentReminders: {
        type: Boolean,
        default: true,
      },
      adminMessages: {
        type: Boolean,
        default: true,
      },
    },

    settings: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      language: {
        type: String,
        default: "en",
      },
      twoFactorEnabled: {
        type: Boolean,
        default: false,
      },
    },

    bio: {
      type: String,
      default: null,
    },

    phoneNumber: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
