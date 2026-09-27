import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import PaymentStatesPage from "./pages/PaymentStatesPage";
import CartProvider from "./context/CartContext";
import ScrollTop from "./components/common/ScrollTop";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import AboutPage from "./pages/AboutPage";
import WishlistPage from "./pages/WishlistPage";
import ThemeProvider from "./context/ThemeContext";
import "./i18n";
import { useEffect, useState } from "react";
import { getProducts } from "./services/product.service";
import { useTranslation } from "react-i18next";
import WishlistProvider from "./context/WishlistContext";
import LoadingFailed from "./pages/LoadingFailed";
import { useToast } from "./context/ToastContext";

function App() {
  const { t, i18n } = useTranslation();
  const { showError } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(false);

  const currentLanguage = i18n.language;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productData = await getProducts();
        setProducts(productData.data);
      } catch (error) {
        showError(error);
        setLoadingFailed(true);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [showError]);

  const frequencyMap = products.reduce((acc, product) => {
    const category = product.category[currentLanguage];
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return (
    <>
      <ScrollTop />
      <AnimatePresence
        mode="wait
      "
      >
        <AuthProvider>
          <WishlistProvider>
            <ThemeProvider>
              <CartProvider t={t}>
                <Routes>
                  <Route
                    element={
                      <MainLayout
                        categories={categories}
                        loading={loading}
                        t={t}
                        currentLanguage={currentLanguage}
                      />
                    }
                  >
                    <Route
                      path="/"
                      element={
                        loadingFailed ? (
                          <LoadingFailed />
                        ) : (
                          <HomePage
                            t={t}
                            currentLanguage={currentLanguage}
                            products={products}
                            loadingProducts={loading}
                            categories={categories}
                          />
                        )
                      }
                    />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route
                      path="/product/:id"
                      element={<ProductDetailsPage />}
                    />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route
                      path="/payment-success"
                      element={<PaymentSuccessPage />}
                    />
                    <Route path="/orders" element={<MyOrdersPage />} />
                    <Route path="/dashboard" element={<AdminDashboardPage />} />
                    <Route
                      path="/admin-products"
                      element={<AdminProductsPage />}
                    />
                    <Route
                      path="/payment-states"
                      element={<PaymentStatesPage />}
                    />
                  </Route>
                </Routes>
              </CartProvider>
            </ThemeProvider>
          </WishlistProvider>
        </AuthProvider>
      </AnimatePresence>
    </>
  );
}

export default App;
