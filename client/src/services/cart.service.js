import api from "./api";

export const addToCart = async (productId, quantity) => {
  const response = await api.post("/cart", {
    "items":[{
        "product": productId,
        "quantity": quantity
    }
    ]
  });

  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart");
  return response;
}