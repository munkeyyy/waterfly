import mongoose, { Schema } from "mongoose";

const InvoiceSchema = new Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
      required: true,
    },
    supplies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "supply",
      },
    ],
    date: {
      type: Date,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("invoice", InvoiceSchema);
