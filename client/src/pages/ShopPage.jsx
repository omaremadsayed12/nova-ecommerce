import { ArrowRight, Star } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import FlowUpTransition from "../components/common/Transitions/FlowUpTransition";
import FiltersSection from "../components/shop/FiltersSection";
import FiltersSectionSkeleton from "../components/shop/Skeletons/FiltersSectionSkeleton";

function ShopPage({ products, categories, loading, currentLanguage, t }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategories = searchParams.getAll("category");

  const filteredProducts = products.filter((product) => {
    if (selectedCategories.length === 0) {
      return true;
    } else {
      return selectedCategories.includes(
        product.category[currentLanguage].toLowerCase(),
      );
    }
  });

  const prices = filteredProducts.map((product) => product.price);

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <div className="shop-page">
      {loading ? (
        <FlowUpTransition>
          <FiltersSectionSkeleton />
        </FlowUpTransition>
      ) : (
        <FlowUpTransition>
          <FiltersSection t={t} categories={categories} minPrice={minPrice} maxPrice={maxPrice} />
        </FlowUpTransition>
      )}
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={product.imageUrl}
                alt={product.name[currentLanguage]}
                className="h-72 w-full object-cover"
              />
            </Link>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {product.category[currentLanguage]}
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />{" "}
                  {product.averageRating}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold tracking-[-0.04em] text-slate-900">
                {product.name[currentLanguage]}
              </h3>
              <div className="mt-5 flex items-center justify-between">
                <div className="text-2xl font-black tracking-tighter text-slate-900">
                  {product.price}
                </div>
                <Link
                  to={`/product/${product._id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                >
                  View <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopPage;
