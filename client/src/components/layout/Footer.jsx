import { Link } from "react-router-dom";
import Container from "./Container";

function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <div className="text-3xl font-black tracking-[-0.08em] text-slate-900">NOVA</div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
              Crafted for those who value timeless design, lasting quality, and effortless luxury.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li><Link to="/shop" className="transition hover:text-slate-900">New Arrivals</Link></li>
              <li><Link to="/shop" className="transition hover:text-slate-900">Best Sellers</Link></li>
              <li><Link to="/shop" className="transition hover:text-slate-900">Accessories</Link></li>
              <li><Link to="/design-system" className="transition hover:text-slate-900">Journal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Support</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li><Link to="/orders" className="transition hover:text-slate-900">Shipping & Returns</Link></li>
              <li><Link to="/auth" className="transition hover:text-slate-900">Account</Link></li>
              <li><Link to="/checkout" className="transition hover:text-slate-900">Payment</Link></li>
              <li><Link to="/payment-states" className="transition hover:text-slate-900">Order Status</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Newsletter</h3>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row xl:flex-col">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
              <button type="button" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
                Join Now
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-5 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 NOVA. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop" className="transition hover:text-slate-900">Privacy Policy</Link>
            <Link to="/shop" className="transition hover:text-slate-900">Terms</Link>
            <Link to="/design-system" className="transition hover:text-slate-900">Style Guide</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;