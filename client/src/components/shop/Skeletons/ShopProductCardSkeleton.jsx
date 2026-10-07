import { Image } from "lucide-react";

function ShopProductCardSkeleton() {
  return (
    <div className="shop__product-card">
      <div>
        <div className="flex h-72 w-full items-center justify-center skeleton">
          <Image className="w-42 h-42 text-(--line)" />
        </div>
      </div>
      <div className="p-5">
        <div className="topline">
          <div className="h-3.5 w-11 skeleton"/>
          <span className="rating">
            <div className="w-4 h-4 skeleton"/>
            <div className="h-4 w-2 skeleton"/>
          </span>
        </div>
        <div className="mt-4 h-7 w-3/4 max-w-60 skeleton"/>
        <div className="details">
          <div className="h-8 w-16 skeleton"/>
          <div className="inline-flex min-w-28 items-center justify-between gap-2 rounded-full border border-(--line) px-4 py-3">
            <div className="h-4 w-16 skeleton"/>
            <div className="h-4 w-4 skeleton"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopProductCardSkeleton;
