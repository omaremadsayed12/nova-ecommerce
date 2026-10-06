import { useContext, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { createOrder } from "../services/order.service";
import { initiatePayment } from "../services/payment.service";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function CheckoutPage() {
  const { user, openAuth } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [shippingAddress, setShippingAddress] = useState("");
  const [checkout, setCheckout] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(() => localStorage.getItem("nova_pending_order") || "");

  const startCheckout = async (event) => {
    event.preventDefault();
    if (!user) { openAuth(); return; }
    if (!stripePromise) { setError("Card checkout is not configured. Add the Stripe publishable key to the client environment."); return; }
    if (!cart.length && !orderId) { setError("Your cart is empty."); return; }
    setBusy(true);
    setError("");
    try {
      let activeOrderId = orderId;
      if (!activeOrderId) {
        const order = await createOrder({ items: cart.map(({ product, quantity }) => ({ product, quantity })) }, shippingAddress);
        activeOrderId = order._id;
        setOrderId(activeOrderId);
        localStorage.setItem("nova_pending_order", activeOrderId);
      }
      const payment = await initiatePayment(activeOrderId);
      setCheckout({ clientSecret: payment.clientSecret, paymentId: payment.paymentId, orderId: activeOrderId });
    } catch (requestError) {
      setError(requestError.response?.data?.error?.message || "Could not start checkout. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-8">
      <h1 className="mb-8 text-4xl font-black text-slate-900">Complete your order</h1>
      {checkout ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret: checkout.clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      ) : (
        <form onSubmit={startCheckout} className="max-w-2xl space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block font-semibold text-slate-800" htmlFor="shipping-address">Shipping address</label>
          <textarea id="shipping-address" required={!orderId} value={shippingAddress} onChange={(event) => setShippingAddress(event.target.value)} rows={4} className="w-full rounded-2xl border border-slate-300 p-4" placeholder="Street, city, postal code, country" />
          {orderId && <p className="text-sm text-slate-600">Order {orderId} is ready for payment. Your cart was kept until payment confirmation.</p>}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="w-full rounded-full bg-slate-900 px-6 py-3 font-bold text-white disabled:opacity-50">
            {busy ? "Preparing secure checkout..." : orderId ? "Retry payment" : "Continue to secure payment"}
          </button>
          <Link className="block text-center text-sm text-slate-600 underline" to="/cart">Return to cart</Link>
        </form>
      )}
    </div>
  );
}

export default CheckoutPage;
