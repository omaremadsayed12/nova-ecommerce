import { useCallback, useContext, useEffect, useState } from "react";
import { Activity, CreditCard, Package, ShoppingBag, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAdminStats } from "../services/stats.service";
import { useTranslation } from "react-i18next";

function formatMoney(amount, currency, language) {
  return new Intl.NumberFormat(language, { style: "currency", currency }).format(amount || 0);
}

function AdminDashboardPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.language === "ar" ? "ar-EG-u-nu-latn" : "en-US";
  const { user, isAuthenticated, authLoading, openAuth } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminStats();
      setStats(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.error?.message || t("common.loadingError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (authLoading || user?.role !== "ADMIN") return undefined;
    const timer = window.setTimeout(loadStats, 0);
    return () => window.clearTimeout(timer);
  }, [authLoading, user, loadStats, refreshKey]);

  if (authLoading) return <p role="status" className="p-8">{t("adminDashboard.loadingAccount")}</p>;
  if (!isAuthenticated) return <div className="mx-auto max-w-2xl p-8 text-center"><p>{t("adminDashboard.signIn")}</p><button onClick={openAuth} className="mt-4 rounded-full bg-slate-900 px-5 py-3 font-bold text-white">{t("common.signIn")}</button></div>;
  if (user?.role !== "ADMIN") return <div role="alert" className="mx-auto max-w-2xl p-8 text-center text-red-800">{t("adminDashboard.accessRequired")}</div>;

  const cards = [
    { label: t("adminDashboard.orders"), value: stats?.totalOrders ?? "-", icon: ShoppingBag },
    { label: t("adminDashboard.products"), value: stats?.totalProducts ?? "-", icon: Package },
    { label: t("adminDashboard.activeProducts"), value: stats?.activeProducts ?? "-", icon: Activity },
    { label: t("adminDashboard.customers"), value: stats?.customers ?? "-", icon: Users },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 md:px-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">{t("adminDashboard.title")}</span><h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">{t("adminDashboard.overview")}</h1></div><div className="flex gap-3"><Link to="/admin-products" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold">{t("adminDashboard.manageProducts")}</Link><Link to="/orders" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold">{t("adminDashboard.viewOrders")}</Link></div></div>
      {loading && <p role="status" className="mb-5 rounded-2xl bg-white p-5 text-slate-600">{t("adminDashboard.loading")}</p>}
      {error && <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"><p>{error}</p><button onClick={() => setRefreshKey((key) => key + 1)} className="mt-3 font-bold underline">{t("common.tryAgain")}</button></div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-sm font-semibold text-slate-500"><span>{label}</span><span className="rounded-full bg-slate-100 p-2 text-slate-700"><Icon className="h-4 w-4" /></span></div><p className="mt-6 text-4xl font-black text-slate-900">{value}</p></article>)}</div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 text-xl font-black text-slate-900"><CreditCard className="h-5 w-5" /> {t("adminDashboard.revenue")}</h2><p className="mt-1 text-sm text-slate-500">{t("adminDashboard.revenueDescription")}</p>{!loading && (stats?.revenueByCurrency?.length ? <ul className="mt-5 space-y-3">{stats.revenueByCurrency.map((revenue) => <li key={revenue.currency} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><span className="font-semibold text-slate-600">{t("adminDashboard.orderCount", { count: revenue.orders })} ({revenue.currency})</span><span className="text-xl font-black text-slate-900">{formatMoney(revenue.revenue, revenue.currency, language)}</span></li>)}</ul> : <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-slate-600">{t("adminDashboard.noPaidOrders")}</p>)}</section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black text-slate-900">{t("adminDashboard.recentOrders")}</h2>{!loading && stats?.recentOrders?.length ? <ul className="mt-5 divide-y divide-slate-100">{stats.recentOrders.map((order) => <li key={order._id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-semibold text-slate-800">{t("adminDashboard.order", { orderId: order._id })}</p><p className="mt-1 text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString(language)} · {t(`ordersPage.statuses.${order.status}`, { defaultValue: order.status })} / {t(`ordersPage.paymentStatuses.${order.paymentStatus}`, { defaultValue: order.paymentStatus })}</p></div><span className="font-bold text-slate-900">{formatMoney(order.total, order.currency, language)}</span></li>)}</ul> : !loading ? <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-slate-600">{t("adminDashboard.noOrders")}</p> : null}</section>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
