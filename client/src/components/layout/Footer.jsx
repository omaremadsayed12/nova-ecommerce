import { Link } from "react-router-dom";
import Container from "./Container";
import { useTranslation } from "react-i18next";
import { Mail, Phone } from "lucide-react";

function Footer({ categories, loading }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <footer>
      <Container className="py-12">
        <div className="upper__footer">
          <div>
            <div className="logo">{t("footer.upperFooter.logo")}</div>
            <p>{t("footer.upperFooter.paragraph")} </p>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <h3>{t("footer.upperFooter.explore")}</h3>
              {loading ? (
                <ul>
                  <li className="loading__item" />
                  <li className="loading__item" />
                  <li className="loading__item" />
                  <li className="loading__item" />
                </ul>
              ) : (
                <ul>
                  {categories.map((category) => {
                    return (
                      <li>
                        <Link to="/shop">{category[currentLanguage]}</Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div>
              <h3>{t("footer.upperFooter.contactUs")}</h3>
              <ul>
                <li>
                  <Link to="tel:+201023811518">
                    <Phone />
                    <div dir="ltr">+20 102 3811 518</div>
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

        <div className="lower__footer">
          <p>{t("footer.lowerFooter.paragraph")}</p>
          <div className="flex flex-wrap">
            <Link to="/privacy-policy">
              {t("footer.lowerFooter.privacyPolicy")}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
