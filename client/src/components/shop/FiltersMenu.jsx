import { ArrowDownNarrowWide, ArrowDownWideNarrow } from "lucide-react";
import {  useState } from "react";
import { useSearchParams } from "react-router-dom";
import DropdownTransition from "../common/Transitions/DropdownTransition";
import { useTranslation } from "react-i18next";

function FiltersMenu({ minPrice, maxPrice, categories }) {
  const { t,i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSort, setSelectedSort] = useState(searchParams.get("sort"));
  const [sortMethod, setSortMethod] = useState(searchParams.get("method"));
  const [filteredMinPrice, setFilteredMinPrice] = useState(
    searchParams.get("minPrice"),
  );
  const [filteredMaxPrice, setFilteredMaxPrice] = useState(
    searchParams.get("maxPrice"),
  );
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.getAll("category"),
  );
  const handleChange = (event) => {
    const newSort = event.target.value;
    setSelectedSort(newSort);
    const params = new URLSearchParams(searchParams);
    params.delete("sort");
    params.set("sort", newSort);
    params.delete("page");
    setSearchParams(params);
  };
  const switchSort = () => {
    const newMethod = sortMethod === "asc" ? "desc" : "asc";
    setSortMethod(newMethod);
    const params = new URLSearchParams(searchParams);
    params.delete("method");
    params.set("method", newMethod);
    params.delete("page");
    setSearchParams(params);
  };
  const handleMinPrice = (event) => {
    const newMin = event.target.value;
    setFilteredMinPrice(newMin);
    const params = new URLSearchParams(searchParams);
    params.delete("minPrice");
    if (newMin != minPrice) params.set("minPrice", newMin);
    params.delete("page");
    setSearchParams(params);
  };
  const handleMaxPrice = (event) => {
    const newMax = event.target.value;
    setFilteredMaxPrice(newMax);
    const params = new URLSearchParams(searchParams);
    params.delete("maxPrice");
    if (newMax != maxPrice) params.set("maxPrice", newMax);
    params.delete("page");
    setSearchParams(params);
  };
  const handleAll = () => {
    setSelectedCategories([]);
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("page");
    setSearchParams(params);
  };
  const handleSelect = (newCategory) => {
    const updatedCategories = selectedCategories.includes(newCategory)
      ? selectedCategories.filter((category) => category !== newCategory)
      : [...selectedCategories, newCategory];
    setSelectedCategories(updatedCategories);
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    updatedCategories.forEach((category) => {
      params.append("category", category);
    });
    params.delete("page");
    setSearchParams(params);
  };
  return (
    <DropdownTransition>
      <div className="filters-menu">
        <h3>Sort & Filter</h3>
        <div className="menu">
          <div className="sort">
            <label htmlFor="sort">Sort By:</label>
            <select
              id="sort"
              value={selectedSort || "createdAt"}
              onChange={handleChange}
            >
              <option value="createdAt">Creation Date</option>
              <option value="price">Price</option>
              <option value="averageRating">Rating</option>
              <option value="name">Name</option>
            </select>
            <button onClick={switchSort}>
              {sortMethod === "desc" ? (
                <ArrowDownWideNarrow />
              ) : (
                <ArrowDownNarrowWide />
              )}
            </button>
          </div>
          <div className="price-filter">
            <label>Price:</label>
            <form>
              <input
                id="min"
                value={filteredMinPrice || minPrice}
                type="number"
                min={minPrice}
                onChange={handleMinPrice}
                max={maxPrice}
              />
              and
              <input
                id="max"
                value={filteredMaxPrice || maxPrice}
                type="number"
                min={minPrice}
                onChange={handleMaxPrice}
                max={maxPrice}
              />{" "}
            </form>
          </div>
          <div className="category-filters">
            <label>Category:</label>
            <button
              key="all"
              className={selectedCategories.length === 0 ? "active" : ""}
              onClick={handleAll}
            >
              {t("shop.filtersSection.all")}
            </button>
            {categories.map((category) => {
              return (
                <button
                  key={category.slug}
                  className={
                    selectedCategories.includes(category.slug) ? "active" : ""
                  }
                  onClick={() => handleSelect(category.slug)}
                >
                  {category.name[currentLanguage]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </DropdownTransition>
  );
}

export default FiltersMenu;
