import { Image } from "lucide-react";

function ProductCardSkeleton() {
  return (
      <div className="product-card">
        <div>
          <div className="h-72 w-auto skeleton flex items-center justify-center">
            <Image className="w-42 h-42 text-(--line)" />
          </div>
        </div>
        <div className="p-5">
          <div className="topline m-2">
            <span className="w-16 h-4 skeleton"/>
            <div className="flex gap-2">
              <div className="rounded-full border p-1 border-(--line)"
              >
                <div
                  className="w-4 h-4 skeleton"
                />
              </div>
              <div className="rounded-full border p-1 border-(--line)"
              >
                <div
                  className="w-4 h-4 skeleton"
                />
              </div>
            </div>
          </div>
          <div className="h-7 w-60 skeleton"/>
          <div className="details">
            <div className="rating">
              <div className="w-4 h-4 skeleton" />
              <span className="w-3 h-4 skeleton"/>
            </div>
            <div className="price inline-flex">
                <div className="w-4 h-6 skeleton mx-1"/>
                <div className="w-10 h-6 skeleton"/>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ProductCardSkeleton;
