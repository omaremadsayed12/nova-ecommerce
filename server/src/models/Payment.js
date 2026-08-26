import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    provider: {
      type: String,
      enum: ["STRIPE", "EDFAPAY"],
      default: "STRIPE",
    },
    providerPaymentId: {
      type: String,
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
      type: Date 
  }},
  {
    timestamps: true,
  },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
