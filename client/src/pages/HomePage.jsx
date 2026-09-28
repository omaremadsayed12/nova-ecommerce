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

function HomePage({
  t,
  currentLanguage,
  products,
  loadingProducts,
  categories,
}) {
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsLoadingFailed, setStatsLoadingFailed] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await getStats();
        setStats(statsData.data);
      } catch (error) {
        showError("Failed to load stats:", error);
        setStatsLoadingFailed(true);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [showError]);

  const carouselProducts =
    products.length > 0
      ? [
          ...[...products]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5),
          products[0],
        ]
      : [];
  if (statsLoadingFailed) return <LoadingFailed t={t} />;

  return (
    <div className="pb-20">
      {loadingProducts || loadingStats ? (
        <FlowUpTransition>
          <HeroSkeleton />
        </FlowUpTransition>
      ) : (
        <FlowUpTransition>
          <HeroSection
            t={t}
            currentLanguage={currentLanguage}
            stats={stats}
            carouselProducts={carouselProducts}
          />
        </FlowUpTransition>
      )}
      {loadingProducts ? (
        <FlowUpTransition>
          <ProductsSkeleton />
        </FlowUpTransition>
      ) : (
        <FlowUpTransition>
          <Products
            t={t}
            currentLanguage={currentLanguage}
            products={products}
          />
        </FlowUpTransition>
      )}
      {loadingProducts ? (
        <FlowUpTransition>
          <CategoriesSkeleton />
        </FlowUpTransition>
      ) : (
        <FlowUpTransition>
          <CategoriesSection
            t={t}
            currentLanguage={currentLanguage}
            categories={categories}
          />
        </FlowUpTransition>
      )}
    </div>
  );
}

export default HomePage;
