import ShopProductCardSkeleton from "./ShopProductCardSkeleton";

function ProductsListSkeleton() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ShopProductCardSkeleton />
        <ShopProductCardSkeleton />
        <ShopProductCardSkeleton />
        <ShopProductCardSkeleton />
    </div>
  );
}

export default ProductsListSkeleton;
