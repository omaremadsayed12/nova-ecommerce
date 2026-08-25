import Products from "../models/Product.js";

const get_all_products = async () => {
  return await Products.find();
};

const get_product_details = async (productId) => {
  return await Products.findById(productId);
};

const add_product = async (productData, creator) => {
  const newProduct = new Products(productData);
  newProduct.createdBy = creator._id;
  newProduct.updatedBy = creator._id;
  return await newProduct.save();
};

const check_product = async (productId) => {
  const product = Products.findById(productId);
  return !!product;
};

const update_product = async (productId, productData, updater) => {
  const updateData = Object.fromEntries(
    Object.entries(productData).filter(([_, value]) => value !== null),
  );
  return await Products.findByIdAndUpdate(
    productId,
    { ...updateData, updatedBy: updater._id },
    {
      returnDocument: "after",
    },
  );
};

const delete_product = async (productId) => {
  return await Products.findByIdAndDelete(productId);
};

const validate_product_input = async (productData) => {
  const { name, price, currency, category } = productData;
  let error = {};
  let isValid = true;

  if (!name || name.length < 2) {
    error.name = "Product name must be at least 2 characters long";
    isValid = false;
  }

  if (!category || category.length < 2) {
    error.category = "Product category must be at least 2 characters long";
    isValid = false;
  }
  if (!currency) {
    error.currency = "Product currency is required";
    isValid = false;
  }

  if (!price || price <= 0) {
    error.price = "Product price must be a positive number";
    isValid = false;
  }

  return { error, isValid };
};

const validate_product_update_input = async (productData) => {
  const { name, price, category } = productData;
  let error = {};
  let isValid = true;

  if (name && name.length < 2) {
    error.name = "Product name must be at least 2 characters long";
    isValid = false;
  }

  if (price && price <= 0) {
    error.price = "Product price must be a positive number";
    isValid = false;
  }

  if (category && category.length < 2) {
    error.category = "Product category must be at least 2 characters long";
    isValid = false;
  }

  return { error, isValid };
};

export default {
  get_all_products,
  get_product_details,
  add_product,
  check_product,
  update_product,
  delete_product,
  validate_product_input,
  validate_product_update_input,
};
