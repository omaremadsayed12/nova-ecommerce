import ProductCardSkeleton from "./ProductCardSkeleton";

function ProductsSkeleton() {
  return (
    <section className="products-section">
      <div className="headline">
        <div className="min-w-0 flex-1">
          <span className="eyebrow">
            <div className="h-3.5 w-16 skeleton" />
          </span>
          <div className="mt-2 h-12 w-full max-w-lg skeleton" />
        </div>
        <div className="inline-flex justify-center content-center items-center">
          <div className="h-4 w-20 skeleton mx-1" />
          <div className="w-4 h-4 skeleton" />
        </div>
      </div>
      <div className="product-cards">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    </section>
  );
}

export default ProductsSkeleton;
