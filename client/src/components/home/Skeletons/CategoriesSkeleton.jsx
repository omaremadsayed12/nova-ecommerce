
import CategoryBoxSkeleton from "./CategoryBoxSkeleton";

function CategoriesSkeleton() {
  return (
    <section className="categories">
      <div className="headline">
        <div className="h-12 w-full max-w-lg skeleton"/>
      </div>
      <div className="category-boxes">
          <CategoryBoxSkeleton/>
          <CategoryBoxSkeleton/>
          <CategoryBoxSkeleton/>
          <CategoryBoxSkeleton/>
          <CategoryBoxSkeleton/>
      </div>
    </section>
  );
}

export default CategoriesSkeleton;
