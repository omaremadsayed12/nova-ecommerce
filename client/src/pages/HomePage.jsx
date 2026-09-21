import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import {  useContext, useEffect, useState } from "react";
import { getStats } from "../services/stats.service";
import { ToastContext } from "../context/ToastContext";
import HeroSection from "../components/homePage/HeroSection";

function HomePage({t,currentLanguage, products, loadingProducts, categories}) {
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const {showError}= useContext(ToastContext);


  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await getStats();
        setStats(statsData.data);
      } catch (error) {
        showError("Failed to load stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [showError]);

  const carouselProducts =
    products.length > 0
      ? [...products, products[0]]
      : [];

  return (
    <div className="pb-20">
      <HeroSection t={t} currentLanguage={currentLanguage} stats={stats} carouselProducts={carouselProducts} loadingStats={loadingStats} loadingCarouselProducts={loadingProducts}/>
      <section className="mx-auto mt-16 w-full max-w-[1440px] px-6 md:px-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="eyebrow">
              Curated Picks
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.07em] text-slate-900 md:text-5xl">
              Shop our best sellers.
            </h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-2 font-bold text-slate-900 md:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product._id} className="card-surface overflow-hidden">
              <Link to={`/product/${product._id}`}>
                <img src={product.imageUrl} alt={product.name} className="h-72 w-full object-cover" />
              </Link>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{product.tag}</span>
                  <button className="rounded-full border border-slate-200 p-2 text-slate-600 hover:border-slate-400" onClick={() => { }}>
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-[-0.04em] text-slate-900">{product.name[currentLanguage]}</h3>
                <div className="mt-3 flex items-center justify-between">
                  {/* <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold text-slate-700">4.9</span>
                  </div> */}
                  <div className="text-lg font-black text-slate-900"> {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: product.currency,
                  }).format(product.price)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* <section className="mx-auto mt-20 w-full max-w-[1440px] px-6 md:px-20">
        <div className="rounded-[32px] bg-[#0d1d32] p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-200">
                Made to last
              </span>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.07em] md:text-5xl">Elevate the everyday with now-worthy essentials.</h2>
            </div>
            <div className="text-slate-300 md:text-right">
              From smart accessories to elevated home pieces, every item is built for quiet confidence and long-term use.
            </div>
          </div>
        </div>
      </section> */}

      <section className="mx-auto mt-20 w-full max-w-[1440px] px-6 md:px-20">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-black tracking-[-0.07em] text-slate-900 md:text-5xl">Browse by category.</h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {categories.map((category, index) => (
            <div key={category} className="rounded-[28px] border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">0{index + 1}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Shop</span>
              </div>
              <h3 className="mt-8 text-3xl font-black tracking-[-0.06em] text-slate-900">{category[currentLanguage]}</h3>
              <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
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
