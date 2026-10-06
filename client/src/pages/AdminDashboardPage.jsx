import { useCallback, useContext, useEffect, useState } from "react";
import { Activity, CreditCard, Package, ShoppingBag, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAdminStats } from "../services/stats.service";

function formatMoney(amount, currency) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount || 0);
}

function AdminDashboardPage() {
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
      setError(requestError.response?.data?.error?.message || "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || user?.role !== "ADMIN") return undefined;
    const timer = window.setTimeout(loadStats, 0);
    return () => window.clearTimeout(timer);
  }, [authLoading, user, loadStats, refreshKey]);

  if (authLoading) return <p role="status" className="p-8">Loading account...</p>;
  if (!isAuthenticated) return <div className="mx-auto max-w-2xl p-8 text-center"><p>Sign in with an administrator account to view dashboard data.</p><button onClick={openAuth} className="mt-4 rounded-full bg-slate-900 px-5 py-3 font-bold text-white">Sign in</button></div>;
  if (user?.role !== "ADMIN") return <div role="alert" className="mx-auto max-w-2xl p-8 text-center text-red-800">Administrator access is required to view this dashboard.</div>;

  const cards = [
    { label: "Orders", value: stats?.totalOrders ?? "-", icon: ShoppingBag },
    { label: "Products", value: stats?.totalProducts ?? "-", icon: Package },
    { label: "Active products", value: stats?.activeProducts ?? "-", icon: Activity },
    { label: "Customers", value: stats?.customers ?? "-", icon: Users },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 md:px-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">Admin Dashboard</span><h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">Store overview</h1></div><div className="flex gap-3"><Link to="/admin-products" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold">Manage products</Link><Link to="/orders" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold">View orders</Link></div></div>
      {loading && <p role="status" className="mb-5 rounded-2xl bg-white p-5 text-slate-600">Loading dashboard...</p>}
      {error && <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"><p>{error}</p><button onClick={() => setRefreshKey((key) => key + 1)} className="mt-3 font-bold underline">Try again</button></div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-sm font-semibold text-slate-500"><span>{label}</span><span className="rounded-full bg-slate-100 p-2 text-slate-700"><Icon className="h-4 w-4" /></span></div><p className="mt-6 text-4xl font-black text-slate-900">{value}</p></article>)}</div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 text-xl font-black text-slate-900"><CreditCard className="h-5 w-5" /> Paid revenue</h2><p className="mt-1 text-sm text-slate-500">Completed and paid orders, grouped by currency.</p>{!loading && (stats?.revenueByCurrency?.length ? <ul className="mt-5 space-y-3">{stats.revenueByCurrency.map((revenue) => <li key={revenue.currency} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><span className="font-semibold text-slate-600">{revenue.currency} ({revenue.orders} orders)</span><span className="text-xl font-black text-slate-900">{formatMoney(revenue.revenue, revenue.currency)}</span></li>)}</ul> : <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-slate-600">No paid orders yet.</p>)}</section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black text-slate-900">Recent orders</h2>{!loading && stats?.recentOrders?.length ? <ul className="mt-5 divide-y divide-slate-100">{stats.recentOrders.map((order) => <li key={order._id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-semibold text-slate-800">Order {order._id}</p><p className="mt-1 text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()} · {order.status} / {order.paymentStatus}</p></div><span className="font-bold text-slate-900">{formatMoney(order.total, order.currency)}</span></li>)}</ul> : !loading ? <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-slate-600">No orders yet.</p> : null}</section>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
