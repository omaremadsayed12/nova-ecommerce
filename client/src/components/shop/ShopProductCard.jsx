import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function ShopProductCard({ product }) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language === "ar" ? "ar" : "en";
  const isRTL = document.documentElement.dir === "rtl";
  const name = product.name?.[currentLanguage] || product.name?.en || "Product";
  const category = product.category?.[currentLanguage] || product.category?.en || "";
  const currency = product.currency || "USD";

  return (
    <div className="shop__product-card"><Link to={`/product/${product._id}`}><img src={product.imageUrl} alt={name} /></Link><div className="p-5"><div className="topline"><span className="category">{category}</span><span className="rating"><Star />{product.averageRating ?? 0}</span></div><h3>{name}</h3><div className="details"><div className="price">{new Intl.NumberFormat(currentLanguage, { style: "currency", currency }).format(product.price)}</div><Link to={`/product/${product._id}`}>View {isRTL ? <ArrowLeft /> : <ArrowRight />}</Link></div></div></div>
  );
}

export default ShopProductCard;