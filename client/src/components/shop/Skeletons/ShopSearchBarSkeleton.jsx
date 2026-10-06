function ShopSearchBarSkeleton() {
  return (
    <div className="w-full">
      <div className="px-5 md:px-8">
        <div className="mx-auto flex max-w-5xl items-center gap-3 rounded-full border border-slate-200 bg-(--base) dark:border-slate-700">
          <div className="ml-3 shrink-0 w-5 h-5 skeleton" />
          <div className="min-w-0 w-4xl flex-1 border-0 bg-transparent px-1 py-3 outline-none">
            <div className="h-5 w-44 skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopSearchBarSkeleton;
