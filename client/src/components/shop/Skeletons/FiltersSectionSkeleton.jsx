function FiltersSectionSkeleton() {
  return (
    <>
      <div className="filters-section">
        <div>
          <span className="mb-2">
            <div className="w-24 h-3.5 skeleton" />
          </span>
          <div className="w-2xl h-12 skeleton" />
        </div>
        <button>
          <div className="w-4 h-4 skeleton" />
          <div className="w-20 h-4 skeleton" />
        </button>
      </div>
      <div className="category-filters mt-4">
        <button key="1">
          <div className="w-14 h-6 skeleton" />
        </button>
        <button key="2">
          <div className="w-14 h-6 skeleton" />
        </button>
        <button key="3">
          <div className="w-14 h-6 skeleton" />
        </button>
        <button key="4">
          <div className="w-14 h-6 skeleton" />
        </button>
        <button key="5">
          <div className="w-14 h-6 skeleton" />
        </button>
        <button key="6">
          <div className="w-14 h-6 skeleton" />
        </button>
        <button key="7">
          <div className="w-14 h-6 skeleton" />
        </button>
      </div>
    </>
  );
}

export default FiltersSectionSkeleton;
