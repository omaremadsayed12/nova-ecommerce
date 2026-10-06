import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

function ShopSearchBar() {
  const { t } = useTranslation();
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
    <div className="w-full"><div className="px-5 md:px-8"><form className="mx-auto flex max-w-5xl items-center gap-3 rounded-full border border-(--line) bg-(--base) transition focus-within:border-(--line)" onSubmit={(event) => event.preventDefault()}><Search className="ms-3 h-5 w-5 shrink-0 text-(--muted)" aria-hidden="true" /><input className="min-w-0 flex-1 border-0 bg-transparent px-1 py-3 text-sm text-(--ink) outline-none placeholder:text-(--muted)" type="search" value={query} onChange={handleChange} placeholder={t("search.placeholder")} aria-label={t("search.placeholder")} /></form></div></div>
  );
}

export default ShopSearchBar;
