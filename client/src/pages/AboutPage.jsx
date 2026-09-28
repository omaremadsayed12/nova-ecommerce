import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import FlowUpTransition from "../components/common/Transitions/FlowUpTransition";

function AboutPage({ t, currentLanguage }) {
  return (
    <main>
      <FlowUpTransition>
        <section className="about-nova">
          <p className="headline">
            <ShoppingBag aria-hidden="true" />
            {t("about.eyebrow")}
          </p>
          <h1>{t("about.title")}</h1>
          <p className="description">{t("about.description")}</p>
          <Link to="/shop">
            {t("about.shopCta")}
            {currentLanguage === "en" ? (
              <ArrowRight aria-hidden="true" />
            ) : (
              <ArrowLeft aria-hidden="true" />
            )}
          </Link>
        </section>
      </FlowUpTransition>

      <FlowUpTransition>
        <section className="who-we-are">
          <div>
            <p className="label">{t("about.overviewLabel")}</p>
            <h2>{t("about.overviewTitle")}</h2>
          </div>
          <p className="description">{t("about.overviewDescription")}</p>
        </section>
      </FlowUpTransition>

      <FlowUpTransition>
        <section className="experience">
          <div className="headline">
            <p className="label">{t("about.commitmentsLabel")}</p>
            <h2>{t("about.commitmentsTitle")}</h2>
          </div>
          <div className="articles">
            <article>
              <ShoppingBag aria-hidden="true" />
              <h3>{t("about.selectionTitle")}</h3>
              <p>{t("about.selectionDescription")}</p>
            </article>
            <article>
              <CreditCard aria-hidden="true" />
              <h3>{t("about.paymentTitle")}</h3>
              <p>{t("about.paymentDescription")}</p>
            </article>
            <article>
              <PackageCheck aria-hidden="true" />
              <h3>{t("about.deliveryTitle")}</h3>
              <p>{t("about.deliveryDescription")}</p>
            </article>
          </div>
        </section>
      </FlowUpTransition>

      <FlowUpTransition>
        <section className="ready">
          <div>
            <h2>{t("about.closingTitle")}</h2>
            <p>{t("about.closingDescription")}</p>
          </div>
          <Link to="/shop">
            {t("about.shopCta")}
            {currentLanguage === "en" ? (
              <ArrowRight aria-hidden="true" />
            ) : (
              <ArrowLeft aria-hidden="true" />
            )}{" "}
          </Link>
        </section>
      </FlowUpTransition>
    </main>
  );
}

export default AboutPage;
