import product_service from "../services/products.service.js";

const get_all_products = async (req, res) => {
    const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const {products, meta} = await product_service.get_all_products(page,limit);
  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: products,
    error: null,
    meta,
  });
};

const get_product_details = async (req, res) => {
  const product_id = req.params.id;
  const product = await product_service.get_product_details(product_id);
  res.status(200).json({
    success: true,
    message: "Product details fetched successfully",
    data: product,
    error: null,
    meta: null,
  });
};

const add_product = async (req, res) => {
  const product_data = req.body;
  const creator = req.user;
  const product = await product_service.add_product(product_data, creator);
  res.status(201).json({
    success: true,
    message: "Product added successfully",
    data: product,
    error: null,
    meta: null,
  });
};

const update_product = async (req, res) => {
  const product_id = req.params.id;
  const product_data = req.body;
  const updater = req.user;
  const product = await product_service.update_product(
    product_id,
    product_data,
    updater,
  );
  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
    error: null,
    meta: null,
  });
};

const delete_product = async (req, res) => {
  const product_id = req.params.id;
  const product = await product_service.delete_product(product_id);
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: product,
    error: null,
    meta: null
  });
};

export default {
  get_all_products,
  get_product_details,
  add_product,
  update_product,
  delete_product,
};
