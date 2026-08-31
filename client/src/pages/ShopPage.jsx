import { ArrowRight, SlidersHorizontal, Star } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Chrono Series", price: "$249", tag: "Accessories", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80" },
  { id: 2, name: "Aero Leather Tote", price: "$189", tag: "Travel", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80" },
  { id: 3, name: "Canvas Low Top", price: "$145", tag: "Footwear", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80" },
  { id: 4, name: "Luna Lamp", price: "$98", tag: "Home", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80" },
  { id: 5, name: "Aurora Watch", price: "$320", tag: "Luxury", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80" },
  { id: 6, name: "Horizon Bag", price: "$210", tag: "Travel", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80" },
  { id: 7, name: "Noir Speaker", price: "$180", tag: "Tech", image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80" },
  { id: 8, name: "Aster Chair", price: "$260", tag: "Home", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80" },
];

const filters = ["All", "Accessories", "Travel", "Home", "Tech", "Footwear"];

function ShopPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-6 md:px-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Shop
          </span>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-slate-900">Explore the collection.</h1>
        </div>
        <button className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 md:flex">
          <SlidersHorizontal className="h-4 w-4" /> Filter & Sort
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              filter === "All" ? "bg-slate-900 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} className="h-72 w-full object-cover" />
            </Link>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{product.tag}</span>
                <span className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold tracking-[-0.04em] text-slate-900">{product.name}</h3>
              <div className="mt-5 flex items-center justify-between">
                <div className="text-2xl font-black tracking-[-0.05em] text-slate-900">{product.price}</div>
                <Link to={`/product/${product.id}`} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white">
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
