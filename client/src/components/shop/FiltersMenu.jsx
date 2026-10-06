import { ArrowDownNarrowWide, ArrowDownWideNarrow, FunnelX } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import DropdownTransition from "../common/Transitions/DropdownTransition";
import { useTranslation } from "react-i18next";

function FiltersMenu({ minPrice, maxPrice, categories }) {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLanguage = i18n.language === "ar" ? "ar" : "en";
  const selectedSort = searchParams.get("sortBy") || "createdAt";
  const sortMethod = (searchParams.get("method") || "DESC").toUpperCase();
  const selectedCategories = searchParams.getAll("category");

  const updateParams = (changes) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      params.delete(key);
      if (value !== null && value !== "") params.set(key, value);
    }
    params.delete("page");
    setSearchParams(params);
  };
  const handleSelect = (slug) => {
    const updated = selectedCategories.includes(slug) ? selectedCategories.filter((category) => category !== slug) : [...selectedCategories, slug];
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    updated.forEach((category) => params.append("category", category));
    params.delete("page");
    setSearchParams(params);
  };
  const clearFilters = () => setSearchParams(new URLSearchParams());
  const priceChange = (field, value) => updateParams({ [field]: value });

  return (
    <DropdownTransition>
      <div className="mt-4 border-t border-slate-200 px-2 pb-2 pt-3 dark:border-slate-700">
        <div className="inline-flex w-full justify-between"><h3 className="m-0 p-0 text-xl font-normal tracking-tight">{t("shopUi.heading")}</h3><button className="btn-secondary flex gap-1 px-2 py-1 text-base" onClick={clearFilters}><FunnelX /> {t("shopUi.clearFilters")}</button></div>
        <div className="menu">
          <div className="sort"><label htmlFor="sortBy">{t("shopUi.sortBy")}</label><select id="sortBy" value={selectedSort} onChange={(event) => updateParams({ sortBy: event.target.value })}><option value="createdAt">{t("shopUi.creationDate")}</option><option value="price">{t("shopUi.priceSort")}</option><option value="averageRating">{t("shopUi.ratingSort")}</option><option value={`name.${currentLanguage}`}>{t("shopUi.nameSort")}</option></select><button aria-label={t("shopUi.sortDirection")} onClick={() => updateParams({ method: sortMethod === "DESC" ? "ASC" : "DESC" })}>{sortMethod === "DESC" ? <ArrowDownWideNarrow /> : <ArrowDownNarrowWide />}</button></div>
          <div className="price-filter"><label>{t("shopUi.price")}</label><form onSubmit={(event) => event.preventDefault()}><input id="min" aria-label={t("shopUi.minimumPrice")} value={searchParams.get("minPrice") ?? minPrice} type="number" min={minPrice} max={maxPrice} onChange={(event) => priceChange("minPrice", event.target.value)} /> {t("shopUi.and")} <input id="max" aria-label={t("shopUi.maximumPrice")} value={searchParams.get("maxPrice") ?? maxPrice} type="number" min={minPrice} max={maxPrice} onChange={(event) => priceChange("maxPrice", event.target.value)} /></form></div>
          <div className="category-filters"><span>{t("shopUi.category")}</span><button className={selectedCategories.length === 0 ? "active" : ""} onClick={() => { const params = new URLSearchParams(searchParams); params.delete("category"); params.delete("page"); setSearchParams(params); }}>{t("shop.filtersSection.all")}</button>{categories.map((category) => <button key={category.slug} className={selectedCategories.includes(category.slug) ? "active" : ""} onClick={() => handleSelect(category.slug)}>{category.name[currentLanguage] || category.name.en}</button>)}</div>
        </div>
      </div>
    </DropdownTransition>
  );
}

export default FiltersMenu;
