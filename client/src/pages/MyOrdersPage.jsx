import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getOrders } from "../services/order.service";
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
  const { isAuthenticated, authLoading, openAuth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    if (authLoading || !isAuthenticated) return undefined;

    let active = true;
    Promise.resolve().then(() => {
      if (!active) return null;
      setLoading(true);
      setError("");
      return getOrders(page);
    }).then((response) => {
      if (active && response) {
        setOrders(response.data || []);
        setMeta(response.meta || { page: 1, totalPages: 1 });
      }
    }).catch((requestError) => {
      if (active) setError(requestError.response?.data?.error?.message || t("ordersPage.loadError"));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [authLoading, isAuthenticated, refreshKey, page, t]);

  const isLoading = authLoading || (isAuthenticated && loading);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-8 md:px-12">
      <div className="mb-8">
        <span className="inline-flex rounded-full border border-(--line) bg-(--base) px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-(--muted)">{t("ordersPage.eyebrow")}</span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-(--ink)">{t("ordersPage.title")}</h1>
      </div>

      {isLoading && <p role="status" className="rounded-2xl bg-(--base) p-6 text-(--muted)">{t("ordersPage.loading")}</p>}
      {!authLoading && !isAuthenticated && <div className="rounded-2xl border border-(--line) bg-(--base) p-8 text-center"><p className="text-(--ink)">{t("ordersPage.signInMessage")}</p><button onClick={openAuth} className="mt-4 rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{t("common.signIn")}</button></div>}
      {!authLoading && isAuthenticated && error && <div role="alert" className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-6 text-red-800 dark:text-red-200"><p>{error}</p><button onClick={() => setRefreshKey((key) => key + 1)} className="mt-3 font-bold underline">{t("common.tryAgain")}</button></div>}
      {!isLoading && isAuthenticated && !error && orders.length === 0 && <div className="rounded-2xl border border-(--line) bg-(--base) p-8 text-center"><h2 className="text-xl font-bold text-(--ink)">{t("ordersPage.emptyTitle")}</h2><p className="mt-2 text-(--muted)">{t("ordersPage.emptyMessage")}</p><Link to="/shop" className="mt-5 inline-block rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{t("common.browseShop")}</Link></div>}

      {!isLoading && !error && orders.length > 0 && <div className="space-y-5">{orders.map((order) => (
        <article key={order._id} className="rounded-3xl border border-(--line) bg-(--base) p-6 shadow-(--shadow-sm)">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--line) pb-4">
            <div><p className="text-xs font-bold uppercase tracking-wider text-(--muted)">{t("ordersPage.order", { orderId: order._id })}</p><p className="mt-2 text-sm text-(--muted)">{t("ordersPage.placed", { date: new Date(order.createdAt).toLocaleDateString(language) })}</p></div>
            <div className="flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle[order.status] || statusStyle.PENDING}`}>{t(`ordersPage.statuses.${order.status}`, { defaultValue: order.status })}</span><span className="rounded-full bg-(--panel-strong) px-3 py-1.5 text-xs font-bold text-(--ink)">{t("ordersPage.payment", { status: t(`ordersPage.paymentStatuses.${order.paymentStatus}`, { defaultValue: order.paymentStatus }) })}</span></div>
          </div>
          <ul className="divide-y divide-(--line)">{order.items.map((item, index) => <li key={`${item.product}-${index}`} className="flex flex-wrap justify-between gap-2 py-4 text-sm"><span className="font-semibold text-(--ink)">{item.name?.[i18n.language] || item.name?.en || t("common.product")} × {item.quantity}</span><span className="text-(--muted)">{formatMoney(item.subtotal, order.currency, language)}</span></li>)}</ul>
          <div className="flex justify-between border-t border-(--line) pt-4 font-bold text-(--ink)"><span>{t("ordersPage.total")}</span><span>{formatMoney(order.total, order.currency, language)}</span></div>
        </article>
      ))}</div>}
      {!isLoading && !error && meta.totalPages > 1 && <nav aria-label={t("ordersPage.pagesLabel")} className="mt-6 flex items-center justify-between"><button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-full border border-(--line) px-4 py-2 font-semibold disabled:opacity-40">{t("ordersPage.previous")}</button><span className="text-sm text-(--muted)">{t("ordersPage.page", { page: meta.page, pages: meta.totalPages })}</span><button disabled={page >= meta.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-full border border-(--line) px-4 py-2 font-semibold disabled:opacity-40">{t("ordersPage.next")}</button></nav>}
    </div>
  );
}

export default MyOrdersPage;
