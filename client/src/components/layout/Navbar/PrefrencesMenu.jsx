import DropdownTransition from "../../common/Transitions/DropdownTransition";
import { NavLink } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import {AuthContext} from "../../../context/AuthContext";


function PrefrencesMenu({ onClose }) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { requireAuth, user } = useContext(AuthContext);
  const defaultImage =
    "https://static.vecteezy.com/system/resources/previews/013/360/247/non_2x/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg";

  const currentLanguage = i18n.language;

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <DropdownTransition>
      <div className="pref-menu" id="preferences-menu">
        <div className="pref-menu__content">
          <NavLink
            key="Settings"
            to="/dashboard"
            onClick={(event) => {
              if (!requireAuth()) {
                event.preventDefault();
              }
              onClose();
            }}
          >
            <img src={user?.imageUrl || defaultImage} alt="" />
            <h5>
              {user?.name[currentLanguage] || t("navbar.prefMenu.login")}{" "}
            </h5>
          </NavLink>
          <div className="option">
            <p>{t("navbar.prefMenu.theme")}</p>
            <div className="option__actions">
              <button
                type="button"
                onClick={() => {
                  setTheme("light");
                  onClose();
                }}
                className={theme === "light" ? "active" : ""}
                aria-label={t("navbar.accessibility.lightTheme")}
                aria-pressed={theme === "light"}
              >
                <Sun size={14} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme("dark");
                  onClose();
                }}
                className={theme === "dark" ? "active" : ""}
                aria-label={t("navbar.accessibility.darkTheme")}
                aria-pressed={theme === "dark"}
              >
                <Moon size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
          <div className="option">
            <p>{t("navbar.prefMenu.lang")}</p>
            <div className="option__actions">
              <button
                type="button"
                onClick={() => {
                  changeLanguage("en");
                  onClose();
                }}
                className={currentLanguage === "en" ? "active" : ""}
                aria-label="English"
                aria-pressed={currentLanguage === "en"}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => {
                  changeLanguage("ar");
                  onClose();
                }}
                className={currentLanguage === "ar" ? "active" : ""}
                aria-label="العربية"
                aria-pressed={currentLanguage === "ar"}
              >
                ع
              </button>
            </div>
          </div>
        </div>
      </div>
    </DropdownTransition>
  );
}

export default PrefrencesMenu;
