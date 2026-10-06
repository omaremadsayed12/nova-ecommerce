import { useEffect, useRef, useState } from "react";
import { Search, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../../../services/product.service";
import DropdownTransition from "../../common/Transitions/DropdownTransition";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

function SearchBar({ onClose }) {
  const { i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [resultsState, setResultsState] = useState({ query: "", products: [] });
  const [errorState, setErrorState] = useState({ query: "", message: "" });
  const [retryKey, setRetryKey] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const normalizedQuery = query.trim();
  const isRTL = document.documentElement.dir === "rtl";

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/shop?query=${encodeURIComponent(normalizedQuery)}`);
    onClose();
  };

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!normalizedQuery) return undefined;
    const controller = new AbortController();
    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ query: normalizedQuery, limit: "6", page: "1", sortBy: "createdAt", method: "DESC" });
        const response = await getProducts(params, { signal: controller.signal });
        if (active) {
          setResultsState({ query: normalizedQuery, products: response.data || [] });
          setErrorState({ query: normalizedQuery, message: "" });
        }
      } catch (error) {
        if (active && error.name !== "CanceledError") {
          setErrorState({ query: normalizedQuery, message: error.response?.data?.error?.message || "Search is unavailable. Please try again." });
        }
      }
    }, 200);
    return () => {
      active = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedQuery, retryKey]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const products = resultsState.query === normalizedQuery ? resultsState.products : [];
  const error = errorState.query === normalizedQuery ? errorState.message : "";
  const loading = Boolean(normalizedQuery) && resultsState.query !== normalizedQuery && !error;
  const language = i18n.language === "ar" ? "ar" : "en";

  return (
    <DropdownTransition>
      <div className="search-bar">
        <div className="search-bar__inner">
          <form className="search-bar__form" onSubmit={handleSubmit}>
            <Search className="search-bar__icon" aria-hidden="true" />
            <input ref={inputRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" className="search-bar__input" />
            <button type="submit" className="search-bar__submit" aria-label="Submit search">{isRTL ? <ArrowLeft /> : <ArrowRight />}</button>
          </form>
          <AnimatePresence mode="wait">
            {normalizedQuery && <DropdownTransition><div className="search-bar__results">
              {loading && <p role="status" className="search-bar__message">Searching...</p>}
              {error && <div role="alert" className="search-bar__message"><p>{error}</p><button type="button" onClick={() => setRetryKey((key) => key + 1)} className="font-bold underline">Try again</button></div>}
              {!loading && !error && products.length === 0 && resultsState.query === normalizedQuery && <p className="search-bar__message">No products found.</p>}
              {products.map((product) => {
                const name = product.name?.[language] || product.name?.en || "Product";
                const category = product.category?.[language] || product.category?.en || "";
                return <Link key={product._id} to={`/product/${product._id}`} className="search-bar__result" onClick={onClose}><img src={product.imageUrl} alt="" className="search-bar__result-image" /><div><div className="search-bar__result-name">{name}</div><div className="search-bar__result-category">{category}</div></div></Link>;
              })}
            </div></DropdownTransition>}
          </AnimatePresence>
        </div>
      </div>
    </DropdownTransition>
  );
}

export default SearchBar;