import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStats } from "../services/stats.service";
import { useToast } from "../context/ToastContext";
import HeroSection from "../components/homePage/HeroSection";
import HeroSkeleton from "../components/homePage/Skeletons/HeroSkeleton";
import ProductsSkeleton from "../components/homePage/Skeletons/ProductsSkeleton";
import FlowUpTransition from "../components/common/Transitions/FlowUpTransition";
import Products from "../components/homePage/Products";
import LoadingFailed from "./LoadingFailed";

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
      <section className="mx-auto mt-20 w-full max-w-[1440px] px-6 md:px-20">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-black tracking-[-0.07em] text-slate-900 md:text-5xl">
            Browse by category.
          </h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={category}
              className="rounded-[28px] border border-slate-200 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                  0{index + 1}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Shop
                </span>
              </div>
              <h3 className="mt-8 text-3xl font-black tracking-[-0.06em] text-slate-900">
                {category}
              </h3>
              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900"
              >
                Discover <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
