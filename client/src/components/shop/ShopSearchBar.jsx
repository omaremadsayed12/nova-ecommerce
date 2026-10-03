import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

function ShopSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const inputRef = useRef(null);
  const handleChange = async (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    if (newQuery !== "") params.set("query", newQuery.toLowerCase().trim());
    params.delete("page");
    setSearchParams(params);
  };
  return (
    <div className="shop__search-bar">
      <div className="search-bar__inner">
        <form onSubmit={(event)=> event.preventDefault()}>
          <Search aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleChange}
            placeholder="Search products"
            aria-label="Search products"
          />
        </form>
      </div>
    </div>
  );
}

export default ShopSearchBar;
