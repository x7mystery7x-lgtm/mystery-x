import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true, // One address per user
    },

    houseNumber: {
      type: String,
      required: true,
    },

    street: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    uuid: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);
export default Address;
