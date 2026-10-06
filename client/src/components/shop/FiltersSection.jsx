import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FiltersMenu from "./FiltersMenu";
import ShopSearchBar from "./ShopSearchBar";
import { getCategories } from "../../services/product.service";
import { useTranslation } from "react-i18next";

function FiltersSection({ minPrice, maxPrice }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language === "ar" ? "ar" : "en";
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return null;
      setLoading(true);
      setLoadingFailed(false);
      setError("");
      const params = new URLSearchParams({ sortBy: `name.${currentLanguage}`, method: "ASC", limit: "0", page: "1" });
      return getCategories(params, { signal: controller.signal });
    }).then((response) => {
      if (active && response) setCategories(response.data || []);
    }).catch((requestError) => {
      if (active && requestError.name !== "CanceledError") {
        setError(requestError.response?.data?.error?.message || t("common.loadingFailed"));
        setLoadingFailed(true);
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
      controller.abort();
    };
  }, [currentLanguage, retryKey, t]);

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1"><span className="eyebrow">{t("shop.filtersSection.eyebrow")}</span><ShopSearchBar /></div>
        <button type="button" onClick={() => setMenuOpen(!menuOpen)} disabled={loadingFailed} className="btn-secondary gap-1 disabled:cursor-not-allowed disabled:opacity-50">
          <motion.div animate={{ rotate: menuOpen ? 90 : 0 }} transition={{ duration: 0.25 }}><SlidersHorizontal /></motion.div>
          {t("shop.filtersSection.filtersButton")}
        </button>
      </div>
      {loadingFailed && <div role="alert" className="mt-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-4 text-amber-900 dark:text-amber-200"><p>{error}</p><button type="button" onClick={() => setRetryKey((key) => key + 1)} className="mt-2 font-bold underline">{t("common.tryAgain")}</button></div>}
      {(menuOpen && !loading && !loadingFailed) && <AnimatePresence mode="wait"><FiltersMenu categories={categories} minPrice={minPrice} maxPrice={maxPrice} /></AnimatePresence>}
    </>
  );
}

export default FiltersSection;
