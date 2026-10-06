import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

function ShopSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const handleChange = (event) => {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    const value = event.target.value.toLowerCase();
    if (value) params.set("query", value);
    params.delete("page");
    setSearchParams(params);
  };
  return (
    <div className="w-full"><div className="px-5 md:px-8"><form className="mx-auto flex max-w-5xl items-center gap-3 rounded-full border border-slate-200 bg-(--base) transition focus-within:border-slate-400 dark:border-slate-700 dark:focus-within:border-slate-600" onSubmit={(event) => event.preventDefault()}><Search className="ml-3 h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" /><input className="min-w-0 flex-1 border-0 bg-transparent px-1 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500" type="search" value={query} onChange={handleChange} placeholder="Search products" aria-label="Search products" /></form></div></div>
  );
}

export default ShopSearchBar;