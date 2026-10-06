import { useCallback, useEffect, useState, createContext } from "react";
import { useToast } from "./ToastContext";
import { useTranslation } from "react-i18next";

export const CartContext = createContext(null);

function readSavedCart() {
  try {
    const savedCart = localStorage.getItem("Cart");
    if (!savedCart) return [];
    const parsed = JSON.parse(savedCart);
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item?.product === "string" && Number.isSafeInteger(item.quantity) && item.quantity > 0)
      : [];
  } catch {
    return [];
  }
}

export default function CartProvider({ children }) {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const [cart, setCart] = useState(readSavedCart);

  useEffect(() => {
    localStorage.setItem("Cart", JSON.stringify(cart));
  }, [cart]);

  const viewCartButton = { url: "/cart", text: t("cartContext.viewCart") };

  const addToCart = (productId, requestedQuantity = 1, maxQuantity = Infinity) => {
    if (!Number.isSafeInteger(requestedQuantity) || requestedQuantity < 1 || requestedQuantity > maxQuantity) {
      showError("Requested quantity is not available.");
      return false;
    }
    if (inCart(productId)) {
      showError(t("cartContext.alreadyOnCart"));
      return false;
    }
    setCart((items) => [...items, { product: String(productId), quantity: requestedQuantity }]);
    showSuccess(t("cartContext.addSuccess"), viewCartButton);
    return true;
  };

  const updateCart = (productId, requestedQuantity = 1, maxQuantity = Infinity) => {
    if (!inCart(productId)) {
      showError(t("cartContext.notOnCart"));
      return false;
    }
    const currentQuantity = cart.find((item) => String(item.product) === String(productId))?.quantity || 0;
    const isReducingQuantity = requestedQuantity < currentQuantity;
    if (!Number.isSafeInteger(requestedQuantity) || requestedQuantity < 1 || (requestedQuantity > maxQuantity && !isReducingQuantity)) {
      showError("Requested quantity is not available.");
      return false;
    }
    setCart((items) => items.map((item) => String(item.product) === String(productId) ? { ...item, quantity: requestedQuantity } : item));
    showSuccess(t("cartContext.updateSuccess"), viewCartButton);
    return true;
  };

  const clearCart = useCallback(() => setCart([]), []);
  const removeFromCart = (productId) => {
    setCart((items) => items.filter((item) => String(item.product) !== String(productId)));
    showSuccess(t("cartContext.removeSuccess"), viewCartButton);
  };
  const inCart = (productId) => cart.some((item) => String(item.product) === String(productId));
  const quantity = (productId) => cart.find((item) => String(item.product) === String(productId))?.quantity || 0;

  return <CartContext.Provider value={{ cart, quantity, addToCart, updateCart, removeFromCart, clearCart, inCart }}>{children}</CartContext.Provider>;
}