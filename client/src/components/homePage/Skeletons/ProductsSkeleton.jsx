import ProductCardSkeleton from "./ProductCardSkeleton"

function ProductsSkeleton() {
  return (
    <section className="products-section">
          <div className="headline">
            <div>
              <span className="eyebrow"><div className="h-3.5 w-16 skeleton"/></span>
              <div className="h-12 w-lg skeleton mt-2"/>
            </div>
            <div className="inline-flex justify-center content-center items-center">
            <div className="h-4 w-20 skeleton mx-1"/>
            <div className="w-4 h-4 skeleton"/>
            </div>
          </div>
          <ProductCardSkeleton/>
        </section>
  )
}

export default ProductsSkeleton