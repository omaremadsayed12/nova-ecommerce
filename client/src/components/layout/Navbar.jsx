import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Container from "./Container";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/design-system" },
  { label: "About", to: "/orders" },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <Container>
          <div className="relative flex h-20 items-center justify-between">
            <div className="hidden items-center gap-8 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
                      isActive
                        ? "border-b border-[#4e7ae9] pb-1 text-[#3e6fe8]"
                        : "text-slate-500 hover:text-slate-900"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <button
              type="button"
              className="flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700 md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <NavLink to="/" className="text-[2rem] font-black tracking-[-0.08em] text-slate-900">
                NOVA
              </NavLink>
            </div>

            <div className="ml-auto flex items-center gap-4 text-slate-600 md:gap-5">
              <button type="button" aria-label="Search" className="hidden transition hover:text-slate-900 md:flex">
                <Search size={18} strokeWidth={2.1} />
              </button>
              <NavLink to="/auth" aria-label="Account" className="transition hover:text-slate-900">
                <UserRound size={18} strokeWidth={2.1} />
              </NavLink>
              <button type="button" aria-label="Wishlist" className="hidden transition hover:text-slate-900 sm:flex">
                <Heart size={18} strokeWidth={2.1} />
              </button>
              <NavLink to="/cart" aria-label="Shopping bag" className="relative transition hover:text-slate-900">
                <ShoppingBag size={18} strokeWidth={2.1} />
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white">
                  1
                </span>
              </NavLink>
            </div>
          </div>
        </Container>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-20 z-40 border-b border-slate-200 bg-white md:hidden">
          <Container className="py-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-3 text-sm font-semibold ${
                      isActive ? "bg-[#eaf1ff] text-[#3e6fe8]" : "text-slate-600"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </>
  );
}

export default Navbar;