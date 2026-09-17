import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLanguage = localStorage.getItem("language") || "en";

document.documentElement.lang = savedLanguage;
document.documentElement.dir =
  savedLanguage === "ar" ? "rtl" : "ltr";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        navbar: {
          home: "Home",
          prefMenu: {
            login: "Login Now",
            theme: "Theme:",
            lang: "Language:"
          }
        },
      },
    },
    ar: {
      translation: {
        navbar: {
          home: "الرئيسية",
          prefMenu: {
            login: "سجل الأن",
            theme: "الوضع:",
            lang: "اللغة:"
          }
        },
      },
    },
  },
  lng: savedLanguage,
  fallbacking: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
