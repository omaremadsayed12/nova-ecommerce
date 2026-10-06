import { useContext, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CartContext } from "../context/CartContext";
import { getProductById } from "../services/product.service";

function formatMoney(amount, currency, language) {
  return new Intl.NumberFormat(language, { style: "currency", currency: currency || "USD" }).format(amount || 0);
}

function CartPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.language === "ar" ? "ar-EG-u-nu-latn" : "en-US";
  const { cart, removeFromCart, updateCart } = useContext(CartContext);
  const productKey = cart.map((item) => String(item.product)).join(",");
  const [productsById, setProductsById] = useState({});
  const [loadedKey, setLoadedKey] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    Promise.resolve().then(async () => {
      setLoadError("");
      if (!productKey) {
        setProductsById({});
        setLoadedKey("");
        return;
      }
      const ids = [...new Set(productKey.split(","))];
      const results = await Promise.allSettled(ids.map(async (id) => {
        const response = await getProductById(id, { signal: controller.signal });
        return [id, response.data];
      }));
      if (!active) return;
      const entries = Object.fromEntries(results.flatMap((result, index) => result.status === "fulfilled" ? [result.value] : [[ids[index], null]]));
      setProductsById(entries);
      if (Object.values(entries).some((product) => !product)) setLoadError(t("cartPage.loadError"));
      setLoadedKey(productKey);
    }).catch((error) => {
      if (active && error.name !== "CanceledError") setLoadError(error.response?.data?.error?.message || t("cartPage.loadError"));
    });
    return () => { active = false; controller.abort(); };
  }, [productKey, t]);

  const loading = loadedKey !== productKey;
  const items = cart.map((item) => ({ ...item, productId: String(item.product), product: productsById[String(item.product)] }));
  const subtotalByCurrency = useMemo(() => items.reduce((totals, item) => {
    if (!item.product) return totals;
    const currency = item.product.currency || "USD";
    totals[currency] = (totals[currency] || 0) + item.product.price * item.quantity;
    return totals;
  }, {}), [items]);
  const unavailable = items.some((item) => !item.product || item.quantity > item.product.stock);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-8 md:px-12">
      <div className="mb-8"><span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">{t("cartPage.eyebrow", "Your bag")}</span><h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">{t("cartPage.title", "Shopping cart")}</h1></div>
      {loading && <p role="status" className="rounded-2xl bg-white p-6 text-slate-600">{t("cartPage.loading")}</p>}
      {loadError && <p role="alert" className="mb-5 rounded-xl bg-amber-50 p-4 text-amber-800">{loadError}</p>}
      {!loading && items.length === 0 && <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center"><h2 className="text-xl font-bold text-slate-900">{t("cartPage.emptyTitle")}</h2><p className="mt-2 text-slate-600">{t("cartPage.emptyMessage")}</p><Link to="/shop" className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-3 font-bold text-white">{t("common.browseShop")}</Link></div>}
      {!loading && items.length > 0 && <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-5">{items.map((item) => {
          const product = item.product;
          const productId = item.productId;
          if (!product) return <div key={productId} className="flex items-center justify-between rounded-3xl border border-amber-200 bg-amber-50 p-5"><span>{t("cartPage.unavailable")}</span><button onClick={() => removeFromCart(productId)} className="rounded-full border p-2" aria-label={t("cartPage.removeUnavailable")}><Trash2 className="h-4 w-4" /></button></div>;
          const name = product.name?.[i18n.language] || product.name?.en || t("common.product");
          const stockExceeded = item.quantity > product.stock;
          return <article key={productId} className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"><img src={product.imageUrl} alt={name} className="h-32 w-full rounded-2xl object-cover sm:w-32" /><div className="flex-1"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-900">{name}</h2><p className="mt-1 text-sm text-slate-500">{product.category?.[i18n.language] || product.category?.en || ""}</p>{stockExceeded && <p role="alert" className="mt-1 text-sm text-red-700">{t("cartPage.stockCount", { count: product.stock })}</p>}</div><button onClick={() => removeFromCart(productId)} className="rounded-full border border-slate-200 p-2 text-slate-500" aria-label={t("cartPage.remove", { name })}><Trash2 className="h-4 w-4" /></button></div><div className="mt-4 flex items-center justify-between gap-4"><div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2"><button disabled={item.quantity <= 1} onClick={() => updateCart(productId, item.quantity - 1, product.stock)} className="rounded-full p-1 disabled:opacity-40" aria-label={t("cartPage.decrease", { name })}><Minus className="h-4 w-4" /></button><span className="min-w-5 text-center font-bold">{item.quantity}</span><button disabled={item.quantity >= product.stock} onClick={() => updateCart(productId, item.quantity + 1, product.stock)} className="rounded-full p-1 disabled:opacity-40" aria-label={t("cartPage.increase", { name })}><Plus className="h-4 w-4" /></button></div><span className="font-bold text-slate-900">{formatMoney(product.price * item.quantity, product.currency, language)}</span></div></div></article>;
        })}</div>
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black text-slate-900">{t("cartPage.summary")}</h2><div className="mt-6 space-y-3 text-sm text-slate-600">{Object.entries(subtotalByCurrency).map(([currency, subtotal]) => <div key={currency} className="flex items-center justify-between"><span>{t("cartPage.subtotal", { currency })}</span><span className="font-bold text-slate-900">{formatMoney(subtotal, currency, language)}</span></div>)}</div><p className="mt-4 text-xs leading-5 text-slate-500">{t("cartPage.finalTotals")}</p><Link aria-disabled={loading || unavailable || cart.length === 0} className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white ${(loading || unavailable || cart.length === 0) ? "pointer-events-none opacity-50" : ""}`} onClick={(event) => { if (loading || unavailable || cart.length === 0) event.preventDefault(); }} to="/checkout">{t("cartPage.checkout")} {i18n.language === "ar" ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}</Link><Link to="/shop" className="mt-3 block text-center text-sm font-bold text-slate-700">{t("common.continueShopping")}</Link></aside>
      </div>}
    </div>
  );
}

export default CartPage;
