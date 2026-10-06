import api from "./api";

export const getProducts = async (params, config = {}) => {
  const response = await api.get(`/products?${params.toString()}`, config);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getCategories = async (params) => {
  const response = await api.get('/categories', {params});
  return response.data;
};

const toProductForm = (product) => {
  const form = new FormData();
  form.append("name", JSON.stringify(product.name));
  form.append("description", JSON.stringify(product.description));
  form.append("category", JSON.stringify(product.category));
  form.append("price", product.price);
  form.append("stock", product.stock);
  form.append("currency", product.currency);
  form.append("isActive", product.isActive);
  if (product.image) form.append("image", product.image);
  return form;
};

export const createProduct = async (product) => {
  const response = await api.post("/products", toProductForm(product));
  return response.data.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.patch(`/products/${id}`, toProductForm(product));
  return response.data.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data.data;
};