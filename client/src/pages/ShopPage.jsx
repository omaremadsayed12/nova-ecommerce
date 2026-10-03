import { useSearchParams } from "react-router-dom";
import FlowUpTransition from "../components/common/Transitions/FlowUpTransition";
import FiltersSection from "../components/shop/FiltersSection";
import FiltersSectionSkeleton from "../components/shop/Skeletons/FiltersSectionSkeleton";
import ProductsList from "../components/shop/ProductsList";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import LoadingFailed from "./LoadingFailed";
import { getProducts } from "../services/product.service";
import { useToast } from "../context/ToastContext";

function ShopPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const { showError } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProducts(searchParams);
        setProducts(response.data);
      } catch (error) {
        showError(t("common.loadingError"), error.response?.error?.message);
        setLoadingFailed(true);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [showError, t,searchParams]);

  const filteredProducts = products.filter((product) => {
    return (
      !query ||
      [product.name, product.category].some((value) =>
        Object.keys(value).some((key) =>
          value[key]?.toLowerCase().includes(query),
        ),
      )
    );
  });

  const prices = filteredProducts.map((product) => product.price);

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  if (loadingFailed) return <LoadingFailed />;

  return (
    <div className="shop-page">
      {loading ? (
        <FlowUpTransition>
          <FiltersSectionSkeleton />
        </FlowUpTransition>
      ) : (
        <FlowUpTransition>
          <FiltersSection minPrice={minPrice} maxPrice={maxPrice} />
        </FlowUpTransition>
      )}
      {loading ? (
        <FlowUpTransition>
          <FiltersSectionSkeleton />
        </FlowUpTransition>
      ) : (
        <FlowUpTransition>
          <ProductsList products={filteredProducts} />
        </FlowUpTransition>
      )}
    </div>
  );
}

export default ShopPage;
