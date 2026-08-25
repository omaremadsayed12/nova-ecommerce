import Cart from "../models/Cart.js";

const get_all_items = async (user) => {
  const cart = await Cart.getOrCreate(user._id);
  return cart.items;
};

const add_items = async (user, items) => {
  const cart = await Cart.getOrCreate(user._id);
  for (const item of cart.items) {
    
  }
  cart.items = items;
  return await cart.save();
};

const update_item = async (user, product_id, quantity) => {
  return await Cart.findOneAndUpdate(
    { user: user._id, "items.product": product_id },
    { $inc: { "items.$.quantity": quantity } },
    { returnDocument: "after" },
  );
};

const remove_item = async (user, product_id) => {
  return await Cart.findOneAndUpdate(
    { user: user._id },
    { $pull: { items: { product: product_id } } },
    { returnDocument: "after" },
  );
};

export default { get_all_items, add_items, update_item, remove_item };
