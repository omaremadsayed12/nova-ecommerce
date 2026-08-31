import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import PaymentStatesPage from "./pages/PaymentStatesPage";
import DesignSystemPage from "./pages/DesignSystemPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin-products" element={<AdminProductsPage />} />
          <Route path="/payment-states" element={<PaymentStatesPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;