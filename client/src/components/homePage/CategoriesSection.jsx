
import CategoryBox from "./CategoryBox";

function CategoriesSection({ categories, t, currentLanguage }) {
  return (
    <section className="categories">
      <div className="headline">
        <h2>{t("homePage.categoriesSection.headline")}</h2>
      </div>
      <div className="category-boxes">
        {categories.map((category, index) => (
          <CategoryBox key={index} category={category} index={index} t={t} currentLanguage={currentLanguage}/>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;
