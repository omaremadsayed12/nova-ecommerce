import ShopSearchBarSkeleton from "./ShopSearchBarSkeleton";

function FiltersSectionSkeleton() {
  return (
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="mb-2 eyebrow">
            <div className="w-24 h-3.5 skeleton" />
          </span>
          <ShopSearchBarSkeleton/>
        </div>
        <div className="btn-secondary gap-1">
          <div className="w-4 h-4 skeleton" />
          <div className="w-20 h-4 skeleton" />
        </div>
      </div>
  );
}

export default FiltersSectionSkeleton;
