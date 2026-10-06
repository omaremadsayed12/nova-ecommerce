import { useEffect, useState } from "react";
import { getStats } from "../services/stats.service";
import { useToast } from "../context/ToastContext";
import HeroSection from "../components/home/HeroSection";
import HeroSkeleton from "../components/home/Skeletons/HeroSkeleton";
import ProductsSkeleton from "../components/home/Skeletons/ProductsSkeleton";
import CategoriesSkeleton from "../components/home/Skeletons/CategoriesSkeleton";
import FlowUpTransition from "../components/common/Transitions/FlowUpTransition";
import Products from "../components/home/Products";
import LoadingFailed from "./LoadingFailed";
import CategoriesSection from "../components/home/CategoriesSection";
import { useTranslation } from "react-i18next";
import { getCategories, getProducts } from "../services/product.service";

function HomePage() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [stats, setStats] = useState([]);
  const [carouselProducts, setCarouselProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const carouselProductsParams = {
          sortBy: "createdAt",
          method: "DESC",
          limit: 5,
          page: 1
        };
        const productParams = new URLSearchParams({
          sortBy: "averageRating",
          method: "DESC",
          limit: 4,
          page: 1
        });
        const categoriesParams ={ 
          sortBy: `name.${currentLanguage}`,
          method: "ASC",
          limit: 0,
          page: 1
        };
        const [statsResponse, carouselProdutsResponse, productsResponse, categoriesResponse] = await Promise.all([
          getStats(),
          getProducts(carouselProductsParams),
          getProducts(productParams),
          getCategories(categoriesParams)
        ]);
        setStats(statsResponse.data);
        setProducts(productsResponse.data);
        setCarouselProducts(carouselProdutsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        showError(t('common.loadingError'), error.response?.error?.message);
        setLoadingFailed(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showError, currentLanguage,t]);

  if (loadingFailed)
    return <LoadingFailed />;

  return (
    <div className="pb-20">
      {loading ? (
        <FlowUpTransition>
          <HeroSkeleton />
        </FlowUpTransition>
      ) : (
        <FlowUpTransition>
          <HeroSection
            stats={stats}
            carouselProducts={carouselProducts}
          />
        </FlowUpTransition>
      )}
      {loading ? (
        <FlowUpTransition>
          <ProductsSkeleton />
        </FlowUpTransition>
      ) : (
        <FlowUpTransition>
          <Products
            products={products}
          />
        </FlowUpTransition>
      )}
      {loading ? (
        <FlowUpTransition>
          <CategoriesSkeleton />
        </FlowUpTransition>
      ) : (
        <FlowUpTransition>
          <CategoriesSection
            categories={categories}
          />
        </FlowUpTransition>
      )}
    </div>
  );
}

export default HomePage;
