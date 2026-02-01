import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    addressUuid: {
      type: String,
      required: true,
      index: true,
    },

    month: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      index: true,
    },

    year: {
      type: Number,
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["paid", "unpaid", "overdue"],
      default: "unpaid",
      index: true,
    },

    paymentDate: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient filtering
paymentSchema.index({ userId: 1, year: 1, month: 1 });
paymentSchema.index({ addressUuid: 1, status: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
