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
      required: [true, "Provider payment ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
    },
    currency: {
      type: String,
      default: "USD",
    },
    merchantReference: {
      type: String,
      required: [true, "Merchant reference is required"],
    },
    status: {
      type: String,
      enum: ["INITIATED", "PENDING", "AUTHORIZED", "PAID", "FAILED", "CANCELLED", "REFUNDED"],
      default: "PAID",
    },
    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    paidAt: {
      type: Date,
      default: Date.now,    
  }},
  {
    timestamps: true,
  },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
