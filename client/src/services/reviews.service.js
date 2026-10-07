import api from "./api";

export const getProductReviews = async (productId, params = {}, config = {}) => {
  const response = await api.get(`/reviews/${productId}`, { ...config, params });
  return response.data;
};

export const getMyProductReview = async (productId, config = {}) => {
  const response = await api.get(`/reviews/${productId}/mine`, config);
  return response.data.data;
};

export const addProductReview = async (productId, review) => {
  const response = await api.post(`/reviews/${productId}`, review);
  return response.data.data;
};
