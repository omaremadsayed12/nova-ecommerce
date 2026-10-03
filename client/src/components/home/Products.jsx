import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";

function Products({ products }) {
  const {t, i18n} = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <section className="products-section">
      <div className="headline">
        <div>
          <span className="eyebrow">{t("home.productsSection.eyebrow")}</span>
          <h2>{t("home.productsSection.headline")}</h2>
        </div>
        <Link to="/shop">
          {t("home.productsSection.link")}{" "}
          {currentLanguage == "en" ? <ArrowRight /> : <ArrowLeft />}
        </Link>
      </div>
      <div className="product-cards">
        {products.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </section>
  );
}

export default Products;
