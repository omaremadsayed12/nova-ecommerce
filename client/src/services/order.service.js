import api from "./api";

export const createOrder = async (cart, shippingAddress) => {
  const response = await api.post("/order", { cart, shippingAddress });
  return response.data.data;
};

export const getOrders = async (page = 1, limit = 12) => {
  const response = await api.get("/order", { params: { page, limit } });
  return response.data;
};
