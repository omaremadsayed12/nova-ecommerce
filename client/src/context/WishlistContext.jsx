import { createContext, useContext, useEffect, useState } from "react";
import { addToWishlist, getWishlist, removeFromWishlist } from "../services/wishlist.service";
import { useToast } from "./ToastContext";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext(null);

export default function WishlistProvider({ children }) {
  const { isAuthenticated, authLoading } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      if (authLoading) return;
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const response = await getWishlist();
        setWishlist(response.data || []);
      } catch (error) {
        showError(error.response?.data?.error?.message);
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, [showError, authLoading, isAuthenticated]);

  const inWishlist = (productId) => {
    return wishlist.some((product) => product === productId);
  };

  const addProductToWishlist = async (productId) => {
    if (inWishlist(productId)) {
      showError("Product already in wishlist");
      return;
    }
    try {
      const response = await addToWishlist(productId);
      const button = {
        url: "/wishlist",
        text: "Open Wishlist",
      };      
      setWishlist(response.data);
      showSuccess(response.message, button);
    } catch (error) {
      showError(error.response?.data?.error?.message);
    }
  };

  const removeProductFromWishlist = async (productId) => {
    if (!inWishlist(productId)) {
      showError("Product not in wishlist");
      return;
    }
    try {
      const response = await removeFromWishlist(productId);
      const button = {
        url: "/wishlist",
        text: "Open Wishlist",
      };      
      setWishlist(response.data);
      showSuccess(response.message, button);
    } catch (error) {
      showError(error.response?.data?.error?.message);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        addProductToWishlist,
        removeProductFromWishlist,
        inWishlist,
        wishlist,
        loadingWishlist: loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
