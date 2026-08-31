import { ArrowRight, ShoppingBag, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../services/product.service";
import { getStats } from "../services/stats.service";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.data);
      } catch (error) {
        setError("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        setError("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const carouselProducts =
    products.length > 0
      ? [...products, products[0]]
      : [];

  useEffect(() => {
    if (carouselProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((current) => current + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselProducts.length]);

  const categories = [
    ...new Set(products.map((product) => product.category))
  ];

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }


  return (
    <div className="pb-20">
      <section className="mx-auto w-full max-w-[1440px] px-6 pt-8 md:px-20 md:pt-12">
        <div className="hero-shell">
          <div className="grid items-center gap-10 px-6 py-10 md:grid-cols-2 md:px-12 md:py-16">
            <div>
              <span className="eyebrow">
                New Collection 2026
              </span>
              <h1 className="mt-6 max-w-xl text-5xl font-black tracking-[-0.08em] text-slate-900 md:text-7xl">
                Refined essentials for everyday luxury.
              </h1>
              <p className="mt-6 max-w-lg text-lg text-slate-600">
                Discover products designed to move effortlessly through your home, wardrobe, and routines.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/shop" className="btn-primary">
                  Shop Collection
                </Link>
              </div>
              
              <div className="mt-9 flex items-center gap-10 text-sm text-slate-500">
              <div>
                <div className="text-2xl font-black text-slate-900">{stats.totalOrders}</div>
                <div>Orders Placed</div>
              </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{stats.totalProducts}</div>
                  <div>Product Available</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[32px] bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
                <div className="overflow-hidden rounded-[28px]">
                  <div
                    className={`flex ${isTransitioning
                      ? "transition-transform duration-700 ease-in-out"
                      : ""
                      }`}
                    style={{
                      transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                    onTransitionEnd={() => {
                      if (currentSlide === products.length) {
                        setIsTransitioning(false);
                        setCurrentSlide(0);

                        requestAnimationFrame(() => {
                          requestAnimationFrame(() => {
                            setIsTransitioning(true);
                          });
                        });
                      }
                    }}
                  >
                    {carouselProducts.map((product, index) => (
                      <div
                        key={`${product._id}-${index}`}
                        className="w-full shrink-0"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-[560px] w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-6 rounded-2xl bg-white p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#eef3ff] p-2 text-slate-900">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] text-slate-500">Fast Delivery</div>
                    <div className="font-bold text-slate-900">2-4 day shipping</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <div key={product.id} className="card-surface overflow-hidden">
              <Link to={`/product/${product._id}`}>
                <img src={product.imageUrl} alt={product.name} className="h-72 w-full object-cover" />
              </Link>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{product.tag}</span>
                  <button className="rounded-full border border-slate-200 p-2 text-slate-600 hover:border-slate-400">
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-[-0.04em] text-slate-900">{product.name}</h3>
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
              <h3 className="mt-8 text-3xl font-black tracking-[-0.06em] text-slate-900">{category}</h3>
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
