import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    subject: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
messageSchema.index({ toUserId: 1, readAt: 1 });
messageSchema.index({ fromUserId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
