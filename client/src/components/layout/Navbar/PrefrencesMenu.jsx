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
      <div className="pref-menu">
        <div className="menu">
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
            <img src={user?.imageUrl || defaultImage} />
            <h5>
              {user?.name[currentLanguage] || t("navbar.prefMenu.login")}{" "}
            </h5>
          </NavLink>
          <div className="option">
            <p>{t("navbar.prefMenu.theme")}</p>
            <div className="option__actions">
              <button
                onClick={() => {
                  setTheme("light");
                  onClose();
                }}
                className={theme === "light" ? "active" : ""}
                aria-label={t("navbar.accessibility.lightTheme")}
              >
                <Sun size={14} strokeWidth={2} />
              </button>
              <button
                onClick={() => {
                  setTheme("dark");
                  onClose();
                }}
                className={theme === "dark" ? "active" : ""}
                aria-label={t("navbar.accessibility.darkTheme")}
              >
                <Moon size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
          <div className="option">
            <p>{t("navbar.prefMenu.lang")}</p>
            <div className="option__actions">
              <button
                onClick={() => {
                  changeLanguage("en");
                  onClose();
                }}
                className={currentLanguage === "en" ? "active" : ""}
              >
                🇬🇧
              </button>
              <button
                onClick={() => {
                  changeLanguage("ar");
                  onClose();
                }}
                className={currentLanguage === "ar" ? "active" : ""}
              >
                🇸🇦
              </button>
            </div>
          </div>
        </div>
      </div>
    </DropdownTransition>
  );
}

export default PrefrencesMenu;
