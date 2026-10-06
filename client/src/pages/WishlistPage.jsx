import { useContext, useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { getProductById } from "../services/product.service";

function formatMoney(amount, currency, language) {
  return new Intl.NumberFormat(language, { style: "currency", currency: currency || "USD" }).format(amount || 0);
}

function WishlistPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.language === "ar" ? "ar-EG-u-nu-latn" : "en-US";
  const { isAuthenticated, authLoading, openAuth } = useContext(AuthContext);
  const { wishlist, loadingWishlist, loadError, retryWishlist, removeProductFromWishlist } = useContext(WishlistContext);
  const { inCart, addToCart } = useContext(CartContext);
  const productKey = wishlist.join(",");
  const [productsById, setProductsById] = useState({});
  const [loadedKey, setLoadedKey] = useState("");
  const [productErrorState, setProductErrorState] = useState({ key: "", message: "" });
  const [retryKey, setRetryKey] = useState(0);
  const requestKey = `${productKey}:${retryKey}`;

  useEffect(() => {
    if (!productKey) return undefined;
    const controller = new AbortController();
    let active = true;
    const ids = [...new Set(productKey.split(","))];
    Promise.allSettled(ids.map(async (id) => {
      const response = await getProductById(id, { signal: controller.signal });
      return [id, response.data];
    })).then((results) => {
      if (!active) return;
      const entries = Object.fromEntries(results.flatMap((result, index) => result.status === "fulfilled" ? [result.value] : [[ids[index], null]]));
      setProductsById((current) => ({ ...current, ...entries }));
      setProductErrorState({
        key: requestKey,
        message: Object.values(entries).some((product) => !product) ? t("wishlistPage.productError") : "",
      });
      setLoadedKey(requestKey);
    }).catch((error) => {
      if (active && error.name !== "CanceledError") {
        setProductErrorState({ key: requestKey, message: error.response?.data?.error?.message || t("wishlistPage.productError") });
        setLoadedKey(requestKey);
      }
    });
    return () => {
      active = false;
      controller.abort();
    };
  }, [productKey, requestKey, t]);

  const loadingProducts = Boolean(productKey) && loadedKey !== requestKey;
  const productError = productErrorState.key === requestKey ? productErrorState.message : "";
  const products = wishlist.map((id) => ({ id, product: productsById[id] }));

  if (authLoading) return <div role="status" className="mx-auto max-w-6xl px-6 py-16 text-(--muted)">{t("wishlistPage.loading")}</div>;
  if (!isAuthenticated) return <main className="mx-auto max-w-3xl px-6 py-20 text-center"><Heart className="mx-auto h-10 w-10 text-(--muted)" /><h1 className="mt-5 text-3xl font-black text-(--ink)">{t("wishlistPage.title")}</h1><p className="mt-3 text-(--muted)">{t("wishlistPage.signInMessage")}</p><button onClick={openAuth} className="mt-6 rounded-full bg-(--ink) px-6 py-3 font-bold text-(--base)">{t("common.signIn")}</button></main>;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-8 md:px-12">
      <div className="mb-8"><p className="text-xs font-bold uppercase tracking-widest text-(--muted)">{t("wishlistPage.eyebrow")}</p><h1 className="mt-3 text-4xl font-black tracking-tight text-(--ink)">{t("wishlistPage.title")}</h1></div>
      {loadError && <div role="alert" className="mb-5 rounded-xl bg-red-50 dark:bg-red-950/40 p-4 text-red-800 dark:text-red-200"><p>{loadError}</p><button onClick={retryWishlist} className="mt-2 font-bold underline">{t("common.tryAgain")}</button></div>}
      {productError && <div role="alert" className="mb-5 rounded-xl bg-amber-50 dark:bg-amber-950/40 p-4 text-amber-800 dark:text-amber-200"><p>{productError}</p><button onClick={() => setRetryKey((key) => key + 1)} className="mt-2 font-bold underline">{t("wishlistPage.retryProducts")}</button></div>}
      {(loadingWishlist || loadingProducts) && !loadError && <p role="status" className="rounded-2xl bg-(--base) p-6 text-(--muted)">{t("wishlistPage.loading")}</p>}
      {!loadingWishlist && !loadingProducts && !loadError && products.length === 0 && <section className="rounded-3xl border border-(--line) bg-(--base) p-10 text-center"><Heart className="mx-auto h-9 w-9 text-(--muted)" /><h2 className="mt-4 text-xl font-bold text-(--ink)">{t("wishlistPage.emptyTitle")}</h2><p className="mt-2 text-(--muted)">{t("wishlistPage.emptyMessage")}</p><Link to="/shop" className="mt-6 inline-flex rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{t("common.browseShop")}</Link></section>}
      {!loadingWishlist && !loadingProducts && products.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map(({ id, product }) => {
        if (!product) return <article key={id} className="flex items-center justify-between rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-5"><span>{t("wishlistPage.unavailable")}</span><button onClick={() => removeProductFromWishlist(id)} className="rounded-full border p-2" aria-label={t("cartPage.removeUnavailable")}><Trash2 className="h-4 w-4" /></button></article>;
        const name = product.name?.[i18n.language] || product.name?.en || t("common.product");
        return <article key={id} className="overflow-hidden rounded-3xl border border-(--line) bg-(--base) shadow-(--shadow-sm)"><Link to={`/product/${id}`}><img src={product.imageUrl} alt={name} className="h-64 w-full object-cover" /></Link><div className="p-5"><p className="text-sm text-(--muted)">{product.category?.[i18n.language] || product.category?.en || ""}</p><h2 className="mt-1 text-xl font-bold text-(--ink)">{name}</h2><div className="mt-4 flex items-center justify-between gap-3"><span className="font-bold">{formatMoney(product.price, product.currency, language)}</span><button onClick={() => removeProductFromWishlist(id)} className="rounded-full border border-(--line) p-2 text-(--muted)" aria-label={t("wishlistPage.remove", { name })}><Trash2 className="h-4 w-4" /></button></div><button disabled={inCart(id) || product.stock < 1} onClick={() => addToCart(id, 1, product.stock)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-(--ink) px-4 py-3 text-sm font-bold text-(--base) disabled:cursor-not-allowed disabled:opacity-50"><ShoppingBag className="h-4 w-4" />{product.stock < 1 ? t("wishlistPage.outOfStock") : inCart(id) ? t("wishlistPage.alreadyInCart") : t("wishlistPage.addToCart")}</button></div></article>;
      })}</div>}
    </main>
  );
}

export default WishlistPage;
