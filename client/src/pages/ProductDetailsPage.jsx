import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const thumbnails = [
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
];

function ProductDetailsPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-6 md:px-20">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-slate-600">
        <ArrowLeft className="h-4 w-4" /> Shop
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-4 md:grid-cols-[90px_1fr]">
          <div className="flex flex-col gap-3">
            {thumbnails.map((thumb, idx) => (
              <button key={idx} className={`overflow-hidden rounded-2xl border ${idx === 0 ? "border-slate-900" : "border-slate-200"}`}>
                <img src={thumb} alt="Product thumbnail" className="h-20 w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3">
            <img
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80"
              alt="Chrono Series"
              className="h-[640px] w-full rounded-[24px] object-cover"
            />
          </div>
        </div>

        <div className="pt-2">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Accessories</span>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-slate-900">Chrono Series</h1>

          <div className="mt-5 flex items-center gap-3 text-slate-600">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <span className="font-semibold">4.9/5 (128 Reviews)</span>
          </div>

          <div className="mt-7 text-4xl font-black tracking-[-0.05em] text-slate-900">$249.00</div>
          <p className="mt-6 text-base leading-7 text-slate-600">
            Meticulously crafted with a focus on form and function. The Chrono Series blends technical precision with a hyper-minimalist aesthetic, designed for those who appreciate silent luxury. Features a sapphire crystal face and surgical-grade stainless steel casing.
          </p>

          <div className="mt-8 flex items-center gap-5">
            <div className="inline-flex items-center gap-4 rounded-full border border-slate-200 bg-white px-3 py-2">
              <button className="rounded-full p-1 text-slate-700 hover:bg-slate-100">
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-5 text-center font-bold text-slate-900">1</span>
              <button className="rounded-full p-1 text-slate-700 hover:bg-slate-100">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </button>
            <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900">
              Buy Now
            </button>
          </div>

          <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-100 p-2 text-emerald-700">✓</span>
              Free standard shipping on orders over $150
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
