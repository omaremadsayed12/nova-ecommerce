import { CreditCard, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-6 md:px-20">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Checkout
        </span>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-slate-900">Complete your order.</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">Shipping Details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400" placeholder="First name" />
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400" placeholder="Last name" />
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 md:col-span-2" placeholder="Street address" />
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400" placeholder="City" />
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400" placeholder="ZIP code" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">Payment Method</h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <CreditCard className="h-5 w-5 text-slate-700" />
                <span className="font-semibold text-slate-700">Visa ending in 4242</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400" placeholder="Card number" />
                  <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400" placeholder="MM / YY" />
                  <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 md:col-span-2" placeholder="CVV" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">Order Summary</h2>
          <div className="mt-6 space-y-5">
            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
              <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80" alt="Chrono Series" className="h-16 w-16 rounded-2xl object-cover" />
              <div className="flex-1">
                <div className="font-bold text-slate-900">Chrono Series</div>
                <div className="text-sm text-slate-500">Qty: 1</div>
              </div>
              <div className="font-bold text-slate-900">$249</div>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between"><span>Subtotal</span><span className="font-bold text-slate-900">$249</span></div>
              <div className="flex items-center justify-between"><span>Shipping</span><span className="font-bold text-slate-900">Free</span></div>
              <div className="flex items-center justify-between"><span>Tax</span><span className="font-bold text-slate-900">$0</span></div>
            </div>

            <div className="border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between text-xl font-black text-slate-900">
                <span>Total</span>
                <span>$249</span>
              </div>
            </div>
          </div>

          <Link to="/payment-success" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
            Pay Now
          </Link>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700">
            <ShieldCheck className="h-4 w-4" /> Secure checkout
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
