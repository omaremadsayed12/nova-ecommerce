import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          unique: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

cartSchema.statics.getOrCreate = async function (userId) {
  let cart = await this.findOne({ user: userId });
  if (!cart) {
    cart = await this.create({
      user: userId,
      items: [],
    });
  }
  return cart;
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
