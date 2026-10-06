import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FlowUpTransition from "../components/common/Transitions/FlowUpTransition";
import FiltersSection from "../components/shop/FiltersSection";
import FiltersSectionSkeleton from "../components/shop/Skeletons/FiltersSectionSkeleton";
import ProductsList from "../components/shop/ProductsList";
import { useTranslation } from "react-i18next";
import { getProducts } from "../services/product.service";
import ProductsListSkeleton from "../components/shop/Skeletons/ProductsListSkeleton";

function ShopPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKey = searchParams.toString();

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return null;
      setLoading(true);
      setError("");
      const params = new URLSearchParams(searchKey);
      if (!params.has("page")) params.set("page", "1");
      if (!params.has("limit")) params.set("limit", "12");
      return getProducts(params, { signal: controller.signal });
    }).then((response) => {
      if (active && response) {
        setProducts(response.data || []);
        setMeta(response.meta || { page: 1, totalPages: 1, total: 0 });
      }
    }).catch((requestError) => {
      if (active && requestError.name !== "CanceledError") {
        setError(requestError.response?.data?.error?.message || t("common.loadingError"));
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; controller.abort(); };
  }, [searchKey, retryKey, t]);

  const prices = products.map((product) => Number(product.price)).filter(Number.isFinite);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const setPage = (nextPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    setSearchParams(params);
  };

  return (
    <div className="shop-page">
      {loading ? <FlowUpTransition><FiltersSectionSkeleton /></FlowUpTransition> : <FlowUpTransition><FiltersSection minPrice={minPrice} maxPrice={maxPrice} /></FlowUpTransition>}
      {error && <div role="alert" className="my-6 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-5 text-red-800 dark:text-red-200"><p>{error}</p><button onClick={() => setRetryKey((key) => key + 1)} className="mt-3 font-bold underline">{t("common.tryAgain")}</button></div>}
      {loading ? <FlowUpTransition><ProductsListSkeleton /></FlowUpTransition> : error ? null : products.length ? <FlowUpTransition><ProductsList products={products} /></FlowUpTransition> : <p className="mt-10 rounded-2xl border border-(--line) bg-(--base) p-8 text-center text-(--muted)">{t("shopUi.empty")}</p>}
      {!loading && !error && meta.totalPages > 1 && <nav aria-label={t("shopUi.pagesLabel")} className="mt-8 flex items-center justify-between"><button disabled={meta.page <= 1} onClick={() => setPage(meta.page - 1)} className="rounded-full border border-(--line) px-4 py-2 font-semibold disabled:opacity-40">{t("shopUi.previous")}</button><span className="text-sm text-(--muted)">{t("shopUi.page", { page: meta.page, pages: meta.totalPages, count: meta.total })}</span><button disabled={meta.page >= meta.totalPages} onClick={() => setPage(meta.page + 1)} className="rounded-full border border-(--line) px-4 py-2 font-semibold disabled:opacity-40">{t("shopUi.next")}</button></nav>}
    </div>
  );
}

export default ShopPage;
