
import { useEffect, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../../services/product.service";
import { motion } from "framer-motion";


function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (event, query) => {
    event.preventDefault();
    navigate(`/shop?query=${encodeURIComponent(query)}`);
    onClose();
  }


  useEffect(() => {
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
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="search-bar">
        <div className="search-bar__inner">
          <form className="search-bar__form" onSubmit={(event) => handleSubmit(event, query)}>
            <Search className="search-bar__icon" aria-hidden="true" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="search-bar__input"
            />
            <button type="submit" className="search-bar__submit" aria-label="Submit search">
              <ArrowRight className="h-4 w-4" />
            </button>

          </form>

          {query.trim() && (
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
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default SearchBar