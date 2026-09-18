import { useState, useContext, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, X, Bolt } from "lucide-react";
import Container from "../Container";
import { CartContext } from "../../../context/CartContext";
import SearchBar from "./SearchBar";
import RouteChangeHandler from "../../common/RouteChangeHandler";
import { AnimatePresence, motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import PrefrencesMenu from "./PrefrencesMenu";
import { useTranslation } from "react-i18next";


const navItems = [
  {
    label: {
      en: "Home",
      ar: "الرئيسية"
    }, to: "/"
  },
  {
    label: {
      en: "Shop",
      ar: "تسوق"
    }, to: "/shop"
  },
  {
    label: {
      en: "The Arsenal",
      ar: "أرسنال"
    }, to: "https://arsenal.com/"
  },
  {
    label: {
      en: "About",
      ar: "تعرف علينا"
    }, to: "/about"
  },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cart } = useContext(CartContext);
  const{i18n} = useTranslation();
  const currentLanguage = i18n.language;

  const handleNavClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeMenus = useCallback(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSettingsMenuOpen(false);
  }, []);

  return (
    <>
      <RouteChangeHandler closeMenus={closeMenus} />
      <header className="navbar">
        <Container>
          <div className="navbar-container">
            <div className="nav-items">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : "inactive"}`
                  }                >
                  {item.label[currentLanguage]}
                </NavLink>
              ))}
            </div>

            <button
              type="button"
              className="mobile-menu-button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="logo">
              <NavLink to="/" onClick={handleNavClick} className="logo-link">
                NOVA
              </NavLink>
            </div>

            <div className="nav-icons">
              <button type="button" aria-label="Search" className="hidden nav-icon md:flex" onClick={() => setSearchOpen(!searchOpen)}>
                <Search size={18} strokeWidth={2.1} />
              </button>
              <NavLink to="/wishlist" aria-label="Wishlist" onClick={handleNavClick} className="hidden nav-icon sm:flex">
                <Heart size={18} strokeWidth={2.1} />
              </NavLink>
              <NavLink to="/cart" aria-label="Shopping bag" onClick={handleNavClick} className="relative nav-icon">
                <ShoppingBag size={18} strokeWidth={2.1} />
                {cart.length > 0 && <span className="nav-span">
                  {cart.length}
                </span>}
              </NavLink>
              <button type="button" aria-label="Preferences" className="hidden nav-icon sm:flex" onClick={() => {
                setSettingsMenuOpen(!settingsMenuOpen)
              }}>
                <motion.div
                  animate={{ rotate: settingsMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Bolt size={18} strokeWidth={2.1} /></motion.div>
              </button>
            </div>
          </div>
        </Container>
      </header >

      {mobileMenuOpen && (
        <MobileMenu
          navItems={navItems}
          onClose={() => setMobileMenuOpen(false)}
        />
      )
      }
      <AnimatePresence mode="wait">
        {searchOpen && <SearchBar
          onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {settingsMenuOpen && <PrefrencesMenu
          onClose={() => setSettingsMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export default Navbar;