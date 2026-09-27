import { useEffect, useState,  createContext } from "react";
import {  useToast } from "./ToastContext";

export const CartContext = createContext(null);

export default function CartProvider({ children, t }) {
  const { showSuccess, showError } = useToast();

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("Cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("Cart", JSON.stringify(cart));
  }, [cart]);

  const viewCartButton = {
    url: "/cart",
    text: t('cartContext.viewCart')
  }

  const addToCart = (productId, quantity = 1) => {
    const newItem = {
      product: productId,
      quantity,
    };
    if (!inCart(productId)) {
      setCart((Items) => [...Items, newItem]);
      showSuccess(t('cartContext.addSuccess'),viewCartButton);
    } else {
      showError(t('cartContext.alreadyOnCart'));
    }
  };

  const updateCart = (productId, quantity = 1) => {
    const newItem = {
      product: productId,
      quantity,
    };
    if (!inCart(productId)) {
      showError(t('cartContext.notOnCart'));
    } else {
      setCart((Items) =>
        Items.map((item) => (item.product === productId ? newItem : item)),
      );
      showSuccess(t('cartContext.updateSuccess'),viewCartButton);
    }
  };

  const removeFromCart = (productId) => {
    setCart((Items) => Items.filter((item) => item.product != productId));
    showSuccess(t('cartContext.removeSuccess'),viewCartButton);
  };

  const inCart = (productId) => {
    return cart.some((item) => item.product === productId);
  };

  const quantity = (productId) => {
    if (!inCart(productId)) {
      return 0;
    }
    const item = cart.find((item) => item.product === productId);
    return item.quantity;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        quantity,
        addToCart,
        updateCart,
        removeFromCart,
        inCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
