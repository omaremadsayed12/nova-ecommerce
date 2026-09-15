import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import { useAuth } from "./context/AuthContext";
import LoginModal from "./components/common/LoginModal";
import AboutPage from "./pages/AboutPage";
import WishlistPage from "./pages/WishlistPage";

function App() {
  const { loginOpen, closeLogin } = useAuth();

  return (
    <BrowserRouter>
      <ScrollTop />
      <AnimatePresence mode="wait
      ">
          <CartProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/orders" element={<MyOrdersPage />} />
                <Route path="/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin-products" element={<AdminProductsPage />} />
                <Route path="/payment-states" element={<PaymentStatesPage />} />
              </Route>
            </Routes>
            <LoginModal
              isOpen={loginOpen}
              onClose={closeLogin}
            />
          </CartProvider>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;