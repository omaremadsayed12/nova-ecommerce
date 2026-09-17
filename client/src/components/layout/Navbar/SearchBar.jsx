
import { useEffect, useRef, useState } from "react";
import { Search, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../../../services/product.service";
import DropdownTransation from "../../common/Transations/DropdownTransation";
import { AnimatePresence } from "framer-motion";


function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const isRTL = document.documentElement.dir === "rtl";


  const handleSubmit = async (event, query) => {
    event.preventDefault();
    navigate(`/shop?query=${encodeURIComponent(query)}`);
    onClose();
  }


  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
    let active = true;


    getProducts()
      .then((response) => {
        if (active) setProducts(response.data || []);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? products.filter((product) =>
      [product.name, product.category].some((value) =>
        value?.toLowerCase().includes(normalizedQuery)
      )
    ).slice(0, 6)
    : [];

  return (
    <DropdownTransation>
      <div className="search-bar">
        <div className="search-bar__inner">
          <form className="search-bar__form" onSubmit={(event) => handleSubmit(event, query)}>
            <Search className="search-bar__icon" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="search-bar__input"
            />
            <button type="submit" className="search-bar__submit" aria-label="Submit search">
              {isRTL ? (
                <ArrowLeft className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}            </button>
          </form>
          <AnimatePresence mode="wait">
            {query.trim() && (
              <DropdownTransation>
                <div className="search-bar__results">
                  {loading && <p className="search-bar__message">Searching...</p>}
                  {!loading && results.length === 0 && (
                    <p className="search-bar__message">No products found.</p>
                  )}
                  {results.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="search-bar__result"
                      onClick={onClose}
                    >
                      <img src={product.imageUrl || product.image} alt="" className="search-bar__result-image" />
                      <div>
                        <div className="search-bar__result-name">{product.name}</div>
                        <div className="search-bar__result-category">{product.category || "Product"}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </DropdownTransation>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DropdownTransation>);
}

export default SearchBar