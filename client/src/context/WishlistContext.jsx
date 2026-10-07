import { createContext, useContext, useEffect, useState } from "react";
import { addToWishlist, getWishlist, removeFromWishlist } from "../services/wishlist.service";
import { useToast } from "./ToastContext";
import { AuthContext } from "./AuthContext";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../services/apiError";

export const WishlistContext = createContext(null);

function normalizeWishlist(value) {
  return Array.isArray(value) ? value.map((product) => String(product?._id || product)).filter(Boolean) : [];
}

export default function WishlistProvider({ children }) {
  const { t } = useTranslation();
  const { user, isAuthenticated, authLoading } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  const [savedWishlist, setSavedWishlist] = useState([]);
  const [loadedScope, setLoadedScope] = useState("");
  const [loadedRequestKey, setLoadedRequestKey] = useState("");
  const [loadErrorState, setLoadErrorState] = useState({ scope: "", message: "" });
  const [retryKey, setRetryKey] = useState(0);
  const scope = isAuthenticated ? String(user?._id || "authenticated") : "guest";
  const requestKey = `${scope}:${retryKey}`;

  useEffect(() => {
    if (authLoading || !isAuthenticated) return undefined;
    const controller = new AbortController();
    let active = true;
    getWishlist({ signal: controller.signal }).then((response) => {
      if (active) {
        setSavedWishlist(normalizeWishlist(response.data));
        setLoadErrorState({ scope, message: "" });
        setLoadedScope(scope);
        setLoadedRequestKey(requestKey);
      }
    }).catch((error) => {
      if (active && error.name !== "CanceledError") {
        setSavedWishlist([]);
        setLoadErrorState({ scope, message: getApiErrorMessage(error, t, "wishlistContext.loadError") });
        setLoadedScope(scope);
        setLoadedRequestKey(requestKey);
      }
    });
    return () => {
      active = false;
      controller.abort();
    };
  }, [authLoading, isAuthenticated, requestKey, scope, t]);

  const wishlist = isAuthenticated && loadedScope === scope ? savedWishlist : [];
  const loadingWishlist = authLoading || (isAuthenticated && loadedRequestKey !== requestKey);
  const inWishlist = (productId) => wishlist.some((id) => String(id) === String(productId?._id || productId));

  const addProductToWishlist = async (productId) => {
    if (inWishlist(productId)) {
      showError(t("wishlistContext.alreadySaved"));
      return false;
    }
    try {
      const response = await addToWishlist(productId);
      setSavedWishlist(normalizeWishlist(response.data));
      setLoadedScope(scope);
      showSuccess(t("wishlistContext.addSuccess"), { url: "/wishlist", text: t("wishlistContext.openWishlist") });
      return true;
    } catch (error) {
      showError(getApiErrorMessage(error, t, "wishlistContext.addError"));
      return false;
    }
  };

  const removeProductFromWishlist = async (productId) => {
    if (!inWishlist(productId)) return false;
    try {
      const response = await removeFromWishlist(productId);
      setSavedWishlist(normalizeWishlist(response.data));
      setLoadedScope(scope);
      showSuccess(t("wishlistContext.removeSuccess"), { url: "/wishlist", text: t("wishlistContext.openWishlist") });
      return true;
    } catch (error) {
      showError(getApiErrorMessage(error, t, "wishlistContext.removeError"));
      return false;
    }
  };

  return (
    <WishlistContext.Provider value={{
      addProductToWishlist,
      removeProductFromWishlist,
      inWishlist,
      wishlist,
      loadingWishlist,
      loadError: isAuthenticated && loadErrorState.scope === scope ? loadErrorState.message : "",
      retryWishlist: () => setRetryKey((key) => key + 1),
    }}>
      {children}
    </WishlistContext.Provider>
  );
}
