import api from "./api";

export const createOrder = async (cart, shippingAddress) => {
  const response = await api.post("/order", { cart, shippingAddress });
  return response.data.data;
};