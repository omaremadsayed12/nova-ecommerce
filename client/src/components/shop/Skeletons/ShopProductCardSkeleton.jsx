import { Image } from "lucide-react";

function ShopProductCardSkeleton() {
  return (
    <div className="shop__product-card">
      <div>
        <div className="h-72 w-auto skeleton flex items-center justify-center">
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
        <div className="h-7 w-60 skeleton"/>
        <div className="details">
          <div className="h-8 w-16 skeleton"/>
          <div className="btn-primary">
            <div className="h-4 w-8 skeleton"/>
            <div className="h-4 w-4 skeleton"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopProductCardSkeleton;
