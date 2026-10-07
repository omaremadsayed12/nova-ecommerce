import { NavLink } from "react-router-dom"
import Container from "../Container"
import { useTranslation } from "react-i18next"

function MobileMenu({navItems, onClose}) {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language === "ar" ? "ar" : "en";
  return (
    <div className="mobile-menu">
          <Container className="py-4">
            <nav aria-label={t("navbar.accessibility.mobileNavigation")}>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
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
  )
}

export default MobileMenu
