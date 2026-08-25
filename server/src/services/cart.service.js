import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const get_all_items = async (user) => {
  const cart = await Cart.getOrCreate(user._id);
  return cart.items;
};

const add_items = async (user, items) => {
  const cart = await Cart.getOrCreate(user._id);
  for (const item of items) {
    if (cart.items.contains({ product: item.product })) {
      throw new Error("Product already in cart");
    }
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error("Product not found");
    }
    if (product.stock < item.quantity) {
      throw new Error("Not enough items in stock");
    } else {
      product.stock -= item.quantity;
      await product.save();
    }
  }
  cart.items.push(...items);
  return await cart.save();
};

const update_item = async (user, product_id, quantity) => {
  const product = await Product.findById(product_id);
  if (!product) {
    throw new Error("Product not found");
  }
  if (product.stock < quantity) {
    throw new Error("Not enough items in stock");
  } else {
    product.stock -= item.quantity;
    return await Cart.findOneAndUpdate(
      { user: user._id, "items.product": product_id },
      { $inc: { "items.$.quantity": quantity } },
      { returnDocument: "after" },
    );
  }
};

const remove_item = async (user, product_id) => {
  return await Cart.findOneAndUpdate(
    { user: user._id },
    { $pull: { items: { product: product_id } } },
    { returnDocument: "after" },
  );
};

export default { get_all_items, add_items, update_item, remove_item };
