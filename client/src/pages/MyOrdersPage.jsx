import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { cancelAdminOrder, cancelOrder as cancelCustomerOrder, createRetryOrder, getOrders } from "../services/order.service";
import { refundOrder } from "../services/payment.service";
import { getApiErrorMessage } from "../services/apiError";
import { useTranslation } from "react-i18next";

const statusStyle = {
  COMPLETED: "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200",
  PENDING: "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200",
  CANCELLED: "bg-(--panel-strong) text-(--ink)",
};

function formatMoney(amount, currency, language) {
  return new Intl.NumberFormat(language, { style: "currency", currency }).format(amount || 0);
}

function MyOrdersPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.language === "ar" ? "ar-EG-u-nu-latn" : "en-US";
  const { user, isAuthenticated, authLoading, openAuth } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [refreshKey, setRefreshKey] = useState(0);
  const [processingOrder, setProcessingOrder] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionNotice, setActionNotice] = useState("");
  const [retryLink, setRetryLink] = useState("");
  const [retryPath, setRetryPath] = useState("");
  const isAdmin = user?.role === "ADMIN";
  const page = Number(searchParams.get("page")) || 1;
  const status = isAdmin ? searchParams.get("status") || "" : "";
  const paymentStatus = isAdmin ? searchParams.get("paymentStatus") || "" : "";
  const search = isAdmin ? searchParams.get("search") || "" : "";
  const paramsKey = searchParams.toString();

  useEffect(() => {
    if (authLoading || !isAuthenticated) return undefined;

    let active = true;
    Promise.resolve().then(() => {
      if (!active) return null;
      setLoading(true);
      setError("");
      return getOrders({
        page,
        limit: 12,
        ...(isAdmin && status ? { status } : {}),
        ...(isAdmin && paymentStatus ? { paymentStatus } : {}),
        ...(isAdmin && search ? { search } : {}),
      });
    }).then((response) => {
      if (active && response) {
        setOrders(response.data || []);
        setMeta(response.meta || { page: 1, totalPages: 1 });
      }
    }).catch((requestError) => {
      if (active) setError(getApiErrorMessage(requestError, t, "ordersPage.loadError"));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [authLoading, isAuthenticated, isAdmin, page, paramsKey, refreshKey, status, paymentStatus, search, t]);

  const updateQuery = (updates) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", "1");
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setSearchParams(next);
  };

  const setPage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    updateQuery({ search: String(formData.get("search") || "").trim() });
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const cancelOrder = async (order) => {
    if (!window.confirm(t("ordersPage.confirmCancel", { orderId: order._id }))) return;
    setProcessingOrder(order._id);
    setActionError("");
    setActionNotice("");
    try {
      if (isAdmin) await cancelAdminOrder(order._id);
      else await cancelCustomerOrder(order._id);
      setActionNotice(t("ordersPage.cancelled"));
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError, t, "ordersPage.actionError"));
    } finally {
      setProcessingOrder("");
    }
  };

  const refundCustomerOrder = async (order) => {
    if (!window.confirm(t("ordersPage.confirmRefund", { orderId: order._id }))) return;
    setProcessingOrder(order._id);
    setActionError("");
    setActionNotice("");
    try {
      const result = await refundOrder(order._id);
      setActionNotice(result.refundStatus === "PENDING" ? t("ordersPage.refundPending") : t("ordersPage.refunded"));
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError, t, "ordersPage.actionError"));
    } finally {
      setProcessingOrder("");
    }
  };

  const retryCustomerOrder = async (order) => {
    setProcessingOrder(order._id);
    setActionError("");
    setActionNotice("");
    setRetryLink("");
    setRetryPath("");
    try {
      const retry = await createRetryOrder(order._id);
      const path = `/checkout?orderId=${encodeURIComponent(retry._id)}`;
      const link = new URL(path, window.location.origin).toString();
      setRetryLink(link);
      setRetryPath(path);
      setActionNotice(t(isAdmin ? "ordersPage.retryLinkCreated" : "ordersPage.retryCustomerReady"));
      setRefreshKey((key) => key + 1);
      if (isAdmin) {
        try {
          await navigator.clipboard.writeText(link);
        } catch {
          setActionError(t("ordersPage.copyRetryLink"));
        }
      }
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError, t, "ordersPage.actionError"));
    } finally {
      setProcessingOrder("");
    }
  };

  const isLoading = authLoading || (isAuthenticated && loading);

  return (
    <section aria-labelledby="orders-page-title" aria-busy={isLoading} className="mx-auto w-full max-w-6xl px-6 pb-20 pt-8 md:px-12">
      <header className="mb-8">
        <span className="inline-flex rounded-full border border-(--line) bg-(--base) px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-(--muted)">{t(isAdmin ? "ordersPage.adminEyebrow" : "ordersPage.eyebrow")}</span>
        <h1 id="orders-page-title" className="mt-4 text-4xl font-black tracking-tight text-(--ink)">{t(isAdmin ? "ordersPage.adminTitle" : "ordersPage.title")}</h1>
      </header>

      {isAdmin && (
        <form role="search" aria-label={t("ordersPage.searchLabel")} onSubmit={submitSearch} className="mb-6 grid gap-3 rounded-3xl border border-(--line) bg-(--base) p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto_auto]">
          <label htmlFor="orders-status-filter" className="grid gap-1 text-sm font-semibold text-(--ink)">
            {t("ordersPage.statusFilter")}
            <select id="orders-status-filter" value={status} onChange={(event) => updateQuery({ status: event.target.value })} className="min-h-11 rounded-xl border border-(--line) bg-(--panel) px-3 text-(--ink)">
              <option value="">{t("ordersPage.allStatuses")}</option>
              <option value="PENDING">{t("ordersPage.statuses.PENDING")}</option>
              <option value="COMPLETED">{t("ordersPage.statuses.COMPLETED")}</option>
              <option value="CANCELLED">{t("ordersPage.statuses.CANCELLED")}</option>
            </select>
          </label>
          <label htmlFor="orders-payment-status-filter" className="grid gap-1 text-sm font-semibold text-(--ink)">
            {t("ordersPage.paymentStatusFilter")}
            <select id="orders-payment-status-filter" value={paymentStatus} onChange={(event) => updateQuery({ paymentStatus: event.target.value })} className="min-h-11 rounded-xl border border-(--line) bg-(--panel) px-3 text-(--ink)">
              <option value="">{t("ordersPage.allPaymentStatuses")}</option>
              <option value="PAID">{t("ordersPage.paymentStatuses.PAID")}</option>
              <option value="UNPAID">{t("ordersPage.paymentStatuses.UNPAID")}</option>
              <option value="REFUNDED">{t("ordersPage.paymentStatuses.REFUNDED")}</option>
            </select>
          </label>
          <label htmlFor="orders-search" className="grid gap-1 text-sm font-semibold text-(--ink)">
            {t("ordersPage.searchLabel")}
            <input id="orders-search" key={search} name="search" type="search" defaultValue={search} maxLength={100} aria-describedby="orders-search-help" className="min-h-11 rounded-xl border border-(--line) bg-(--panel) px-3 text-(--ink)" placeholder={t("ordersPage.searchPlaceholder")} />
            <span id="orders-search-help" className="text-xs font-normal text-(--muted)">{t("ordersPage.searchPlaceholder")}</span>
          </label>
          <button type="submit" className="self-end rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{t("ordersPage.searchAction")}</button>
          <button type="button" onClick={clearFilters} className="self-end rounded-full border border-(--line) px-5 py-3 font-bold text-(--ink)">{t("ordersPage.clearFilters")}</button>
        </form>
      )}

      {actionNotice && <p role="status" aria-live="polite" className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-4 text-emerald-800 dark:text-emerald-200">{actionNotice}</p>}
      {actionError && <p role="alert" className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 p-4 text-red-800 dark:text-red-200">{actionError}</p>}
      {retryLink && isAdmin && <label className="mb-5 grid gap-2 text-sm font-semibold text-(--ink)">{t("ordersPage.retryLinkLabel")}<input readOnly value={retryLink} onFocus={(event) => event.target.select()} className="min-h-11 rounded-xl border border-(--line) bg-(--base) px-3 font-normal" /></label>}
      {retryPath && !isAdmin && <Link to={retryPath} className="mb-5 inline-flex rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{t("ordersPage.retryContinue")}</Link>}

      {isLoading && <p role="status" aria-live="polite" className="rounded-2xl bg-(--base) p-6 text-(--muted)">{t("ordersPage.loading")}</p>}
      {!authLoading && !isAuthenticated && <div className="rounded-2xl border border-(--line) bg-(--base) p-8 text-center"><p className="text-(--ink)">{t("ordersPage.signInMessage")}</p><button onClick={openAuth} className="mt-4 rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{t("common.signIn")}</button></div>}
      {!authLoading && isAuthenticated && error && <div role="alert" className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-6 text-red-800 dark:text-red-200"><p>{error}</p><button onClick={() => setRefreshKey((key) => key + 1)} className="mt-3 font-bold underline">{t("common.tryAgain")}</button></div>}
      {!isLoading && isAuthenticated && !error && orders.length === 0 && <div className="rounded-2xl border border-(--line) bg-(--base) p-8 text-center"><h2 className="text-xl font-bold text-(--ink)">{t("ordersPage.emptyTitle")}</h2><p className="mt-2 text-(--muted)">{t("ordersPage.emptyMessage")}</p>{!isAdmin && <Link to="/shop" className="mt-5 inline-block rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{t("common.browseShop")}</Link>}</div>}

      {!isLoading && !error && orders.length > 0 && <section aria-label={t("ordersPage.title")} className="space-y-5">{orders.map((order) => (
        <article key={order._id} className="rounded-3xl border border-(--line) bg-(--base) p-6 shadow-(--shadow-sm)">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--line) pb-4">
            <div>
              <h2 className="break-all text-sm font-bold text-(--ink)">{t("ordersPage.order", { orderId: order._id })}</h2>
              <dl className="mt-2 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
                {isAdmin && <div><dt className="inline font-semibold text-(--ink)">{t("ordersPage.customer")}: </dt><dd className="inline break-all text-(--muted)">{order.user?.email || t("ordersPage.unknownCustomer")}</dd></div>}
                <div><dt className="inline font-semibold text-(--ink)">{t("ordersPage.dateLabel")}: </dt><dd className="inline text-(--muted)"><time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleDateString(language)}</time></dd></div>
              </dl>
            </div>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex flex-wrap items-center gap-2"><dt className="font-semibold text-(--ink)">{t("ordersPage.orderStatusLabel")}:</dt><dd><span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle[order.status] || statusStyle.PENDING}`}>{t(`ordersPage.statuses.${order.status}`, { defaultValue: order.status })}</span></dd></div>
              <div className="flex flex-wrap items-center gap-2"><dt className="font-semibold text-(--ink)">{t("ordersPage.paymentStatusLabel")}:</dt><dd><span className="inline-flex rounded-full bg-(--panel-strong) px-3 py-1.5 text-xs font-bold text-(--ink)">{t(`ordersPage.paymentStatuses.${order.paymentStatus}`, { defaultValue: order.paymentStatus })}</span></dd></div>
            </dl>
          </div>
          <ul className="divide-y divide-(--line)">{order.items.map((item, index) => <li key={`${item.product}-${index}`} className="flex flex-wrap justify-between gap-2 py-4 text-sm"><span className="font-semibold text-(--ink)">{item.name?.[i18n.language] || item.name?.en || t("common.product")} × {item.quantity}</span><span className="text-(--muted)">{formatMoney(item.subtotal, order.currency, language)}</span></li>)}</ul>
          <dl className="flex justify-between border-t border-(--line) pt-4 font-bold text-(--ink)"><dt>{t("ordersPage.total")}</dt><dd>{formatMoney(order.total, order.currency, language)}</dd></dl>
          {((order.status === "PENDING" && order.paymentStatus === "UNPAID") || (isAdmin && order.paymentStatus === "PAID") || (order.status === "CANCELLED" && order.paymentStatus === "UNPAID")) && <div className="mt-4 flex flex-wrap gap-2 border-t border-(--line) pt-4">
            {order.status === "PENDING" && order.paymentStatus === "UNPAID" && <button type="button" disabled={processingOrder === order._id} onClick={() => cancelOrder(order)} className="rounded-full border border-red-200 dark:border-red-900 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300 disabled:opacity-50">{processingOrder === order._id ? t("ordersPage.processingAction") : t("ordersPage.cancelAction")}</button>}
            {isAdmin && order.paymentStatus === "PAID" && order.paymentMethod === "CREDIT_CARD" && <button type="button" disabled={processingOrder === order._id} onClick={() => refundCustomerOrder(order)} className="rounded-full border border-amber-300 dark:border-amber-800 px-4 py-2 text-sm font-semibold text-amber-800 dark:text-amber-200 disabled:opacity-50">{processingOrder === order._id ? t("ordersPage.processingAction") : t("ordersPage.refundAction")}</button>}
            {order.status === "CANCELLED" && order.paymentStatus === "UNPAID" && <button type="button" disabled={processingOrder === order._id} onClick={() => retryCustomerOrder(order)} className="rounded-full bg-(--ink) px-4 py-2 text-sm font-semibold text-(--base) disabled:opacity-50">{processingOrder === order._id ? t("ordersPage.processingAction") : t(isAdmin ? "ordersPage.retryAction" : "ordersPage.retryCustomerAction")}</button>}
          </div>}
        </article>
      ))}</section>}
      {!isLoading && !error && orders.length > 0 && meta.totalPages > 1 && <nav aria-label={t("ordersPage.pagesLabel")} className="mt-6 flex flex-wrap items-center justify-between gap-3"><button type="button" aria-label={t("ordersPage.previous")} disabled={page <= 1} onClick={() => setPage(page - 1)} className="min-h-11 rounded-full border border-(--line) px-4 py-2 font-semibold text-(--ink) disabled:cursor-not-allowed disabled:opacity-50">{t("ordersPage.previous")}</button><span aria-current="page" className="text-sm text-(--ink)">{t("ordersPage.page", { page: meta.page, pages: meta.totalPages })}</span><button type="button" aria-label={t("ordersPage.next")} disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)} className="min-h-11 rounded-full border border-(--line) px-4 py-2 font-semibold text-(--ink) disabled:cursor-not-allowed disabled:opacity-50">{t("ordersPage.next")}</button></nav>}
    </section>
  );
}

export default MyOrdersPage;
