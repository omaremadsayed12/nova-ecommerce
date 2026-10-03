import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FiltersMenu from "./FiltersMenu";
import ShopSearchBar from "./ShopSearchBar";
import { getCategories } from "../../services/product.service";
import { useToast } from "../../context/ToastContext";
import { useTranslation } from "react-i18next";

function FiltersSection({ minPrice, maxPrice }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { showError } = useToast();
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const params = {
          sortBy: `name.${currentLanguage}`,
          method: "ASC",
          limit: 0,
          page: 1,
        };
        const response = await getCategories(params);
        setCategories(response.data);
      } catch (error) {
        showError(t("common.loadingFailed"), error.response?.error?.message);
        setLoadingFailed(true);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [currentLanguage, showError, t]);

  return (
    <>
      <div className="filters-section">
        <div>
          <span>{t("shop.filtersSection.eyebrow")}</span>
          <ShopSearchBar />
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <motion.div
            animate={{ rotate: menuOpen ? 90 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <SlidersHorizontal />
          </motion.div>
          {t("shop.filtersSection.filtersButton")}
        </button>
      </div>
      {(menuOpen && !loading && !loadingFailed ) && (
        <AnimatePresence mode="wait">
          <FiltersMenu
            categories={categories}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </AnimatePresence>
      )}
    </>
  );
}

export default FiltersSection;
