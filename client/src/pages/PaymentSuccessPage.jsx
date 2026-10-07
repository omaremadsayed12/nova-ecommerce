import { useContext, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getPaymentStatus } from "../services/payment.service";
import { CartContext } from "../context/CartContext";
import { useTranslation } from "react-i18next";

function PaymentSuccessPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const { cart, clearCart } = useContext(CartContext);
  const cartSignature = JSON.stringify(cart);
  const cartSignatureRef = useRef(cartSignature);
  const clearedAfterPayment = useRef(false);
  const paymentId = params.get("paymentId");
  const orderId = params.get("orderId");
  const [status, setStatus] = useState(paymentId ? "CHECKING" : "UNKNOWN");
  const [error, setError] = useState("");
  const [pollingExhausted, setPollingExhausted] = useState(false);
  const [pollRun, setPollRun] = useState(0);

  useEffect(() => {
    cartSignatureRef.current = cartSignature;
  }, [cartSignature]);

  useEffect(() => {
    if (!paymentId) return undefined;
    let active = true;
    let timer;
    let attempts = 0;
    const maxAttempts = 12;
    const poll = async () => {
      attempts += 1;
      try {
        const responseStatus = await getPaymentStatus(paymentId);
        if (!active) return;
        const next = ["PAID", "FAILED", "CANCELLED", "REFUNDED", "PENDING"].includes(responseStatus)
          ? responseStatus
          : "UNKNOWN";
        setStatus(next);
        setError("");
        if (next === "PAID" && localStorage.getItem("nova_pending_order") === orderId && !clearedAfterPayment.current) {
          clearedAfterPayment.current = true;
          const savedCart = localStorage.getItem("nova_pending_cart");
          if (!savedCart || savedCart === cartSignatureRef.current) clearCart();
          localStorage.removeItem("nova_pending_order");
          localStorage.removeItem("nova_pending_cart");
        }
        if (["FAILED", "CANCELLED"].includes(next) && localStorage.getItem("nova_pending_order") === orderId) {
          localStorage.removeItem("nova_pending_order");
          localStorage.removeItem("nova_pending_cart");
        }
        if (["PAID", "FAILED", "CANCELLED", "REFUNDED"].includes(next)) return;
        if (attempts >= maxAttempts) {
          setPollingExhausted(true);
          return;
        }
        timer = window.setTimeout(poll, 2500);
      } catch {
        if (active) {
          setError(t("paymentPage.statusError"));
          if (attempts >= maxAttempts) {
            setStatus((current) => current === "CHECKING" ? "UNKNOWN" : current);
            setPollingExhausted(true);
            return;
          }
          timer = window.setTimeout(poll, 5000);
        }
      }
    };
    Promise.resolve().then(() => {
      if (!active) return;
      setStatus("CHECKING");
      setError("");
      setPollingExhausted(false);
      poll();
    });
    return () => { active = false; window.clearTimeout(timer); };
  }, [paymentId, orderId, clearCart, pollRun, t]);

  const paid = status === "PAID";
  const terminalFailure = ["FAILED", "CANCELLED"].includes(status);
  const refunded = status === "REFUNDED";
  const pending = status === "PENDING";
  const unknown = status === "UNKNOWN";
  const title = paid ? t("paymentPage.paidTitle") : refunded ? t("paymentPage.refundedTitle") : terminalFailure ? t("paymentPage.failedTitle") : pending ? t("paymentPage.pendingTitle") : unknown ? t("paymentPage.unknownTitle") : t("paymentPage.checkingTitle");
  const message = paid ? t("paymentPage.paidMessage") : refunded ? t("paymentPage.refundedMessage") : terminalFailure ? t("paymentPage.failedMessage") : pending ? t("paymentPage.pendingMessage") : unknown ? t("paymentPage.unknownMessage") : t("paymentPage.checkingMessage");
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
            {paymentId && pollingExhausted && !paid && !refunded && !terminalFailure && <button type="button" onClick={() => setPollRun((run) => run + 1)} className="rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{t("paymentPage.checkAgain")}</button>}
          <Link to="/orders" className="rounded-full border border-(--line) px-5 py-3 font-bold">{t("paymentPage.orders")}</Link>
          <Link to="/shop" className="rounded-full border border-(--line) px-5 py-3 font-bold">{t("paymentPage.shop")}</Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
