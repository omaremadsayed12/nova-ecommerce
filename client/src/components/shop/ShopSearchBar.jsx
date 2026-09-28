import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../services/product.service";

function ShopSearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const handleSubmit = async (event, query) => {
    event.preventDefault();
    navigate(`/shop?query=${encodeURIComponent(query)}`);
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
  const normalizedQuery = query.trim().toLowerCase();
  return (
      <div className="shop__search-bar">
        <div className="search-bar__inner">
          <form onSubmit={(event) => handleSubmit(event, query)}>
            <Search aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
            />
          </form>
        </div>
      </div>);
}

export default ShopSearchBar