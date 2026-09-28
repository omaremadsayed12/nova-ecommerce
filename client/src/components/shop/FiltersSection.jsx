import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FiltersMenu from "./FiltersMenu";
import ShopSearchBar from "./ShopSearchBar";

function FiltersSection({ t, categories, minPrice, maxPrice }) {
  const [menuOpen, setMenuOpen] = useState(false);
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
      {menuOpen && (
        <AnimatePresence mode="wait">
          <FiltersMenu t={t} categories={categories} minPrice={minPrice} maxPrice={maxPrice} />
        </AnimatePresence>
      )}
    </>
  );
}

export default FiltersSection;
