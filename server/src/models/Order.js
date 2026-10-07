import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    retryOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        name: {
          en: {
            type: String,
            required: [true, "Product name is required"],
          },
          ar: {
            type: String,
          },
        },
        imageUrl: {
          type: String,
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
        },
        subtotal: {
          type: Number,
          default: 0,
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    currency: {
      type: String,
      default: "USD",
    },
    paymentStatus: {
      type: String,
      enum: ["PAID", "UNPAID", "REFUNDED"],
      default: "UNPAID",
    },
    paymentMethod: {
      type: String,
      enum: ["CREDIT_CARD", "PAYPAL", "CASH_ON_DELIVERY"],
      default: "CREDIT_CARD",
    },
    shippingAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.index(
  { retryOf: 1 },
  {
    unique: true,
    partialFilterExpression: {
      retryOf: { $exists: true },
      status: "PENDING",
      paymentStatus: "UNPAID",
    },
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
