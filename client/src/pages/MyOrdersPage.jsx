import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getOrders } from "../services/order.service";

const statusStyle = {
  COMPLETED: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-800",
  CANCELLED: "bg-slate-100 text-slate-700",
};

function formatMoney(amount, currency) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount || 0);
}

function MyOrdersPage() {
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
      if (active) setError(requestError.response?.data?.error?.message || "Could not load your orders.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [authLoading, isAuthenticated, refreshKey, page]);

  const isLoading = authLoading || (isAuthenticated && loading);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-8 md:px-12">
      <div className="mb-8">
        <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">My Orders</span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">Track your purchases</h1>
      </div>

      {isLoading && <p role="status" className="rounded-2xl bg-white p-6 text-slate-600">Loading your orders...</p>}
      {!authLoading && !isAuthenticated && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center"><p className="text-slate-700">Sign in to see your orders.</p><button onClick={openAuth} className="mt-4 rounded-full bg-slate-900 px-5 py-3 font-bold text-white">Sign in</button></div>}
      {!authLoading && isAuthenticated && error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800"><p>{error}</p><button onClick={() => setRefreshKey((key) => key + 1)} className="mt-3 font-bold underline">Try again</button></div>}
      {!isLoading && isAuthenticated && !error && orders.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center"><h2 className="text-xl font-bold text-slate-900">No orders yet</h2><p className="mt-2 text-slate-600">Your checkout orders will appear here.</p><Link to="/shop" className="mt-5 inline-block rounded-full bg-slate-900 px-5 py-3 font-bold text-white">Browse the shop</Link></div>}

      {!isLoading && !error && orders.length > 0 && <div className="space-y-5">{orders.map((order) => (
        <article key={order._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Order {order._id}</p><p className="mt-2 text-sm text-slate-500">Placed {new Date(order.createdAt).toLocaleDateString()}</p></div>
            <div className="flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle[order.status] || statusStyle.PENDING}`}>{order.status}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">Payment: {order.paymentStatus}</span></div>
          </div>
          <ul className="divide-y divide-slate-100">{order.items.map((item, index) => <li key={`${item.product}-${index}`} className="flex flex-wrap justify-between gap-2 py-4 text-sm"><span className="font-semibold text-slate-800">{item.name?.en || "Product"} x {item.quantity}</span><span className="text-slate-600">{formatMoney(item.subtotal, order.currency)}</span></li>)}</ul>
          <div className="flex justify-between border-t border-slate-100 pt-4 font-bold text-slate-900"><span>Total</span><span>{formatMoney(order.total, order.currency)}</span></div>
        </article>
      ))}</div>}
      {!isLoading && !error && meta.totalPages > 1 && <nav aria-label="Order pages" className="mt-6 flex items-center justify-between"><button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-full border border-slate-300 px-4 py-2 font-semibold disabled:opacity-40">Previous</button><span className="text-sm text-slate-600">Page {meta.page} of {meta.totalPages}</span><button disabled={page >= meta.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-full border border-slate-300 px-4 py-2 font-semibold disabled:opacity-40">Next</button></nav>}
    </div>
  );
}

export default MyOrdersPage;
