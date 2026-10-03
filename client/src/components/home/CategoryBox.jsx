import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function CategoryBox({ category, index }) {
    const {t,i18n} = useTranslation();
    const currentLanguage =i18n.language;
  
  return (
    <div key={category.slug} className="category-box">
      <div className="top-line">
        <span className="index">0{index + 1}</span>
      </div>
      <h3>{category.name[currentLanguage]}</h3>
      <Link to={`/shop?category=${category.slug}`}>
        {t("home.categoriesSection.categoryBox.button")}{" "}
        {currentLanguage === "en" ? <ArrowRight /> : <ArrowLeft />}
      </Link>
    </div>
  );
}

export default CategoryBox;
