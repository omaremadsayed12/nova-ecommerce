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
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0 });
  const [carouselProducts, setCarouselProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return null;
      setLoading(true);
      setLoadingFailed(false);
      const carouselParams = new URLSearchParams({ sortBy: "createdAt", method: "DESC", limit: "5", page: "1" });
      const productParams = new URLSearchParams({ sortBy: "averageRating", method: "DESC", limit: "4", page: "1" });
      const categoriesParams = new URLSearchParams({ sortBy: `name.${currentLanguage === "ar" ? "ar" : "en"}`, method: "ASC", limit: "0", page: "1" });
      return Promise.all([
        getStats({ signal: controller.signal }),
        getProducts(carouselParams, { signal: controller.signal }),
        getProducts(productParams, { signal: controller.signal }),
        getCategories(categoriesParams, { signal: controller.signal }),
      ]);
    }).then((responses) => {
      if (!active || !responses) return;
      const [statsResponse, carouselResponse, productsResponse, categoriesResponse] = responses;
      setStats(statsResponse.data);
      setCarouselProducts(carouselResponse.data || []);
      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    }).catch((error) => {
      if (active && error.name !== "CanceledError") {
        showError(error.response?.data?.error?.message || t("common.loadingError"));
        setLoadingFailed(true);
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; controller.abort(); };
  }, [showError, currentLanguage, t]);

  if (loadingFailed) return <LoadingFailed />;

  return (
    <div className="pb-20">
      {loading ? <FlowUpTransition><HeroSkeleton /></FlowUpTransition> : <FlowUpTransition><HeroSection stats={stats} carouselProducts={carouselProducts} /></FlowUpTransition>}
      {loading ? <FlowUpTransition><ProductsSkeleton /></FlowUpTransition> : <FlowUpTransition><Products products={products} /></FlowUpTransition>}
      {loading ? <FlowUpTransition><CategoriesSkeleton /></FlowUpTransition> : <FlowUpTransition><CategoriesSection categories={categories} /></FlowUpTransition>}
    </div>
  );
}

export default HomePage;