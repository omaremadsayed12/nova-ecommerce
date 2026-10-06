import { useContext, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getPaymentStatus } from "../services/payment.service";
import { CartContext } from "../context/CartContext";

function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const { cart, clearCart } = useContext(CartContext);
  const clearedAfterPayment = useRef(false);
  const paymentId = params.get("paymentId");
  const orderId = params.get("orderId");
  const [status, setStatus] = useState(paymentId ? "CHECKING" : "UNKNOWN");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!paymentId) return undefined;
    let active = true;
    let timer;
    const poll = async () => {
      try {
        const next = await getPaymentStatus(paymentId);
        if (!active) return;
        setStatus(next);
        if (next === "PAID" && !clearedAfterPayment.current) {
          clearedAfterPayment.current = true;
          clearCart();
          if (localStorage.getItem("nova_pending_order") === orderId) localStorage.removeItem("nova_pending_order");
        }
        if (["FAILED", "CANCELLED"].includes(next) && localStorage.getItem("nova_pending_order") === orderId) {
          localStorage.removeItem("nova_pending_order");
        }
        if (!["PAID", "FAILED", "CANCELLED", "REFUNDED"].includes(next)) timer = window.setTimeout(poll, 2500);
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.error?.message || "Payment status is not available yet.");
          timer = window.setTimeout(poll, 5000);
        }
      }
    };
    poll();
    return () => { active = false; window.clearTimeout(timer); };
  }, [paymentId, orderId, clearCart]);

  const paid = status === "PAID";
  const terminalFailure = ["FAILED", "CANCELLED"].includes(status);
  const refunded = status === "REFUNDED";
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center px-6 py-12">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-4xl font-black text-slate-900">{paid ? "Payment confirmed" : refunded ? "Payment refunded" : terminalFailure ? "Payment not completed" : "Confirming payment"}</h1>
        <p className="mt-4 text-slate-600">{paid ? "Your order is confirmed." : refunded ? "This payment was refunded." : terminalFailure ? "The payment did not complete. Your cart is still available to try again." : "Stripe is processing your payment. This page updates when the server receives confirmation."}</p>
        {orderId && <p className="mt-4 text-sm text-slate-500">Order: {orderId}</p>}
        {error && <p role="alert" className="mt-3 text-sm text-amber-700">{error}</p>}
        {!paid && <p className="mt-3 text-xs text-slate-500">Current payment state: {status}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {terminalFailure && <Link to={cart.length ? "/checkout" : "/shop"} className="rounded-full bg-slate-900 px-5 py-3 font-bold text-white">{cart.length ? "Try checkout again" : "Return to shop"}</Link>}
          <Link to="/orders" className="rounded-full border border-slate-300 px-5 py-3 font-bold">View orders</Link>
          <Link to="/shop" className="rounded-full border border-slate-300 px-5 py-3 font-bold">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;