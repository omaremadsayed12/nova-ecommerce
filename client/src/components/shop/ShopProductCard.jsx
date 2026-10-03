import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function ShopProductCard({ product}) {
  const {i18n} = useTranslation();
  const currentLanguage = i18n.language;
  const isRTL = document.documentElement.dir === "rtl";

  return (
    <div
      key={product._id}
      className="shop__product-card"
    >
      <Link to={`/product/${product._id}`}>
        <img
          src={product.imageUrl}
          alt={product.name[currentLanguage]}
        />
      </Link>
      <div className="p-5">
        <div className="topline">
          <span className="category">
            {product.category[currentLanguage]}
          </span>
          <span className="rating">
            <Star />
            {product.averageRating}
          </span>
        </div>

        <h3>
          {product.name[currentLanguage]}
        </h3>
        <div className="details">
          <div className="price">
            {product.price}
          </div>
          <Link
            to={`/product/${product._id}`}          >
            View {isRTL ? <ArrowLeft /> : <ArrowRight />}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShopProductCard;
