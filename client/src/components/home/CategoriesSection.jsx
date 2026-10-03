
import { useTranslation } from "react-i18next";
import CategoryBox from "./CategoryBox";

function CategoriesSection({ categories }) {
  const {t} = useTranslation();
  return (
    <section className="categories">
      <div className="headline">
        <h2>{t("home.categoriesSection.headline")}</h2>
      </div>
      <div className="category-boxes">
        {categories.map((category, index) => (
          <CategoryBox key={index} category={category} index={index}/>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;
