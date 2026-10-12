import { NavLink } from "react-router-dom";
import Container from "../Container";
import { useTranslation } from "react-i18next";
import DropdownTransition from "../../common/Transitions/DropdownTransition";

function MobileMenu({ navItems, onClose }) {
  navItems = [
    ...navItems,
    {
      label: {
        en: "Wishlist",
        ar: "قائمة الأمنيات",
      },
      to: "/wishlist",
    },
  ];
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language === "ar" ? "ar" : "en";
  return (
    <DropdownTransition>
      <div className="mobile-menu">
        <Container className="py-4">
          <nav aria-label={t("navbar.accessibility.mobileNavigation")}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `${isActive ? "active" : "text-(--muted)"}`
                }
              >
                {item.label[currentLanguage]}
              </NavLink>
            ))}
          </nav>
        </Container>
      </div>
    </DropdownTransition>
  );
}

export default MobileMenu;
