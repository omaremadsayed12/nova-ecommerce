import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const items = [
  { id: 1, name: "Chrono Series", detail: "Silver / 42mm", price: 249, qty: 1, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80" },
  { id: 2, name: "Aero Leather Tote", detail: "Sand / Large", price: 189, qty: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80" },
];

function CartPage() {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 300 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-6 md:px-20">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Your Bag
        </span>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-slate-900">Shopping Cart.</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-5 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
              <img src={item.image} alt={item.name} className="h-32 w-full rounded-[22px] object-cover md:w-32" />

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                  </div>
                  <button className="rounded-full border border-slate-200 p-2 text-slate-500 hover:border-slate-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                    <button className="rounded-full p-1 hover:bg-white"><Minus className="h-4 w-4" /></button>
                    <span className="min-w-4 text-center font-bold text-slate-900">{item.qty}</span>
                    <button className="rounded-full p-1 hover:bg-white"><Plus className="h-4 w-4" /></button>
                  </div>
                  <div className="text-2xl font-black text-slate-900">${item.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">Summary</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between"><span>Subtotal</span><span className="font-bold text-slate-900">${subtotal}</span></div>
            <div className="flex items-center justify-between"><span>Shipping</span><span className="font-bold text-slate-900">{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
            <div className="flex items-center justify-between"><span>Tax</span><span className="font-bold text-slate-900">$0</span></div>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between text-base font-bold text-slate-900">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          <Link to="/checkout" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Link>

          <Link to="/shop" className="mt-3 block text-center text-sm font-bold text-slate-700">Continue Shopping</Link>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
