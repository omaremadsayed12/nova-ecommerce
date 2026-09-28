import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function CategoryBox({ category, index, t, currentLanguage }) {
  return (
    <div key={category["name"]} className="category-box">
      <div className="top-line">
        <span className="index">0{index + 1}</span>
      </div>
      <h3>{category["name"]}</h3>
      <Link to="/shop">
        {t("home.categoriesSection.categoryBox.button")}{" "}
        {currentLanguage === "en" ? <ArrowRight /> : <ArrowLeft />}
      </Link>
    </div>
  );
}

export default CategoryBox;
