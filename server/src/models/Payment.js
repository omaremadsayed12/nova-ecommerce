import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    provider: {
      type: String,
      enum: ["STRIPE"],
      default: "STRIPE",
    },
    providerPaymentId: {
      type: String,
    },
    providerIntentId: {
      type: String,
    },
    refundId: {
      type: String,
    },
    refundStatus: {
      type: String,
      enum: ["PENDING", "SUCCEEDED", "FAILED"],
    },
    lastStatusCheckAt: {
      type: Date,
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["INITIATED", "PENDING", "AUTHORIZED", "PAID", "FAILED", "CANCELLED", "REFUNDED"],
      default: "INITIATED",
    },
    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;