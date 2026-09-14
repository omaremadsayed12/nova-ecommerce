import Products from "../models/Product.js";
import products_validator from "./validators/products.validator.js";

const get_all_products = async () => {
  return await Products.find();
};

const get_product_details = async (productId) => {
  return await products_validator.verify_product(productId);
};

const add_product = async (productData, creator) => {
  await products_validator.validate_product_input(productData);
  const product = new Products(productData);
  product.createdBy = creator._id;
  product.updatedBy = creator._id;
  return await product.save();
};

const update_product = async (productId, productData, updater) => {
  const product = await products_validator.verify_product(productId);
  await products_validator.validate_product_update_input(productData);
  const updateData = Object.fromEntries(
    Object.entries(productData).filter(([_, value]) => value !== null),
  );
  Object.assign(product, updateData, { updatedBy: updater._id });
  await product.updateOne(
    { ...updateData, updatedBy: updater._id },
    {
      new: true,
    },
  );
  return product;
};

const delete_product = async (productId) => {
  const product = await products_validator.verify_product(productId);
  return await product.deleteOne();
};

export default {
  get_all_products,
  get_product_details,
  add_product,
  update_product,
  delete_product,
};
