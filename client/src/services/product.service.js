import api from "./api";

export const getProducts = async (params) => {
  const response = await api.get(`/products?${params.toString()}`);
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
