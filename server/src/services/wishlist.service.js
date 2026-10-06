import { ValidationError } from "./errors.service.js";
import products_validator from "./validators/products.validator.js";

const contains_product = (wishlist, product_id) =>
  wishlist.some((id) => id.toString() === String(product_id));

const get_wishlist = (user) => user.wishlist;

const add_to_wishlist = async (user, product_id) => {
  await products_validator.verify_product(product_id);
  if (contains_product(user.wishlist, product_id)) {
    throw new ValidationError("Product already exists in wishlist");
  }
  user.wishlist.push(product_id);
  user.updatedBy = user._id;
  await user.save();
  return user.wishlist;
};

const remove_from_wishlist = async (user, product_id) => {
  await products_validator.verify_product(product_id);
  if (!contains_product(user.wishlist, product_id)) {
    throw new ValidationError("Product is not in wishlist");
  }
  user.wishlist = user.wishlist.filter((id) => id.toString() !== String(product_id));
  user.updatedBy = user._id;
  await user.save();
  return user.wishlist;
};

export default { get_wishlist, add_to_wishlist, remove_from_wishlist };