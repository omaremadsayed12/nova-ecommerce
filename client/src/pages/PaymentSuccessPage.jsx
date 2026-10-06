import { useContext, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getPaymentStatus } from "../services/payment.service";
import { CartContext } from "../context/CartContext";
import { useTranslation } from "react-i18next";

function PaymentSuccessPage() {
  const { t } = useTranslation();
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
          setError(requestError.response?.data?.error?.message || t("paymentPage.statusError"));
          timer = window.setTimeout(poll, 5000);
        }
      }
    };
    poll();
    return () => { active = false; window.clearTimeout(timer); };
  }, [paymentId, orderId, clearCart, t]);

  const paid = status === "PAID";
  const terminalFailure = ["FAILED", "CANCELLED"].includes(status);
  const refunded = status === "REFUNDED";
  const title = paid ? t("paymentPage.paidTitle") : refunded ? t("paymentPage.refundedTitle") : terminalFailure ? t("paymentPage.failedTitle") : t("paymentPage.checkingTitle");
  const message = paid ? t("paymentPage.paidMessage") : refunded ? t("paymentPage.refundedMessage") : terminalFailure ? t("paymentPage.failedMessage") : t("paymentPage.checkingMessage");
  const statusLabel = t(`paymentPage.statuses.${status}`, { defaultValue: status });
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center px-6 py-12">
      <div className="w-full rounded-3xl border border-(--line) bg-(--base) p-8 text-center shadow-(--shadow-sm)">
        <h1 className="text-4xl font-black text-(--ink)">{title}</h1>
        <p className="mt-4 text-(--muted)">{message}</p>
        {orderId && <p className="mt-4 text-sm text-(--muted)">{t("paymentPage.order", { orderId })}</p>}
        {error && <p role="alert" className="mt-3 text-sm text-amber-700 dark:text-amber-300">{error}</p>}
        {!paid && <p className="mt-3 text-xs text-(--muted)">{t("paymentPage.currentState", { status: statusLabel })}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {terminalFailure && <Link to={cart.length ? "/checkout" : "/shop"} className="rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{cart.length ? t("paymentPage.retryCheckout") : t("paymentPage.returnShop")}</Link>}
          <Link to="/orders" className="rounded-full border border-(--line) px-5 py-3 font-bold">{t("paymentPage.orders")}</Link>
          <Link to="/shop" className="rounded-full border border-(--line) px-5 py-3 font-bold">{t("paymentPage.shop")}</Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
