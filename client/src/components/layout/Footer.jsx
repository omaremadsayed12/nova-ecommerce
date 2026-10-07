import { Link } from "react-router-dom";
import Container from "./Container";
import { Mail, Phone } from "lucide-react";
import FlowUpTransition from "../common/Transitions/FlowUpTransition";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { getCategories } from "../../services/product.service";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../services/apiError";

function Footer() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const { showError } = useToast();

  const navItems = [
    {
      label: {
        en: "Home",
        ar: "الرئيسية",
      },
      to: "/",
    },
    {
      label: {
        en: "Shop",
        ar: "تسوق",
      },
      to: "/shop",
    },
    {
      label: {
        en: "About",
        ar: "تعرف علينا",
      },
      to: "/about",
    },
  ];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const params = {
          sortBy: "count",
          method: "DESC",
          page: 1,
          limit: 4,
        };
        const response = await getCategories(params);
        setCategories(response.data);
      } catch (error) {
        showError(getApiErrorMessage(error, t, "common.loadingFailed"));
        setLoadingFailed(true);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [showError, t]);

  const handleNavClick = (to) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (location.pathname === to) {
      window.location.reload();
    }
  };

  return (
    <footer>
      <AnimatePresence mode="wait">
        <Container className="py-12">
          <FlowUpTransition>
            <div className="upper__footer">
              <div>
                <div className="logo">{t("footer.upperFooter.logo")}</div>
                <p>{t("footer.upperFooter.paragraph")} </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h3>{t("footer.upperFooter.explore")}</h3>
                  <ul>
                    {loading || loadingFailed ? (
                      navItems.map((item) => (
                        <li key={item.to}>
                          <Link to={item.to} onClick={() => handleNavClick(item.to)}>
                            {item.label[currentLanguage]}
                          </Link>
                        </li>
                      ))
                    ) : (
                      categories.map((category) => {
                        const url = `/shop?category=${category.slug}`;
                        return (
                          <li key={category.slug}>
                            <Link to={url} onClick={() => handleNavClick(url)}>
                              {category.name[currentLanguage]}
                            </Link>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>

                <div>
                  <h3>{t("footer.upperFooter.contactUs")}</h3>
                  <ul className="h-full flex justify-between content-center pt-4 pb-12">
                    <li>
                      <Link to="tel:+201001111000">
                        <Phone />
                        <div dir="ltr">+20 100 1111 000</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="mailto:contact@nova.eg">
                        <Mail />
                        <div dir="ltr">contact@nova.eg</div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </FlowUpTransition>

          <div className="lower__footer">
            <p>{t("footer.lowerFooter.paragraph")}</p>
            <div className="flex flex-wrap">
              <Link to="/privacy-policy">
                {t("footer.lowerFooter.privacyPolicy")}
              </Link>
            </div>
          </div>
        </Container>
      </AnimatePresence>
    </footer>
  );
}

export default Footer;
