import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Container from "./Container";
import { CartContext } from "../../context/CartContext";
import SearchBar from "../common/SearchBar";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/design-system" },
  { label: "About", to: "/orders" },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cart } = useContext(CartContext);



  return (
    <>
      <header className="navbar">
        <Container>
          <div className="navbar-container">
            <div className="nav-items">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : "inactive"}`
                  }                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <button
              type="button"
              className="mobile-menu-button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="logo">
              <NavLink to="/" className="logo-link">
                NOVA
              </NavLink>
            </div>

            <div className="nav-icons">
              <button type="button" aria-label="Search" className="hidden nav-icon md:flex" onClick={() => setSearchOpen(!searchOpen)}>
                <Search size={18} strokeWidth={2.1} />
              </button>
              <NavLink to="/auth" aria-label="Account" className="nav-icon">
                <UserRound size={18} strokeWidth={2.1} />
              </NavLink>
              <button type="button" aria-label="Wishlist" className="hidden nav-icon sm:flex">
                <Heart size={18} strokeWidth={2.1} />
              </button>
              <NavLink to="/cart" aria-label="Shopping bag" className="relative nav-icon">
                <ShoppingBag size={18} strokeWidth={2.1} />
                {cart.length > 0 && <span className="nav-span">
                  {cart.length}
                </span>}
              </NavLink>
            </div>
          </div>
        </Container>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Container className="py-4">
            <nav>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `${isActive ? "active" : "text-slate-600"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </Container>
        </div>
      )}
      {searchOpen && <SearchBar
        onClose={() => setSearchOpen(false)} />}
    </>
  );
}

export default Navbar;