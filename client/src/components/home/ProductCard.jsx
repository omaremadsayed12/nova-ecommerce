import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

function ProductCard({  product }) {
  const {i18n, t} = useTranslation();
  const currentLanguage = i18n.language === "ar" ? "ar" : "en";
  const productName = product.name?.[currentLanguage] || product.name?.en || "Product";
  const categoryName = product.category?.[currentLanguage] || product.category?.en || "";
  const { inCart, addToCart, removeFromCart, updateCart, quantity } =
    useContext(CartContext);
  const { inWishlist, addProductToWishlist, removeProductFromWishlist } =
    useContext(WishlistContext);
  const { requireAuth } = useContext(AuthContext);

  const handleWishlist = () => {
    if (inWishlist(product._id)) {
      removeProductFromWishlist(product._id);
    } else {
      addProductToWishlist(product._id);
    }
  };

  const handleMinus = () => {
    const newQuantity = quantity(product._id) - 1;
    if (newQuantity === 0) {
      removeFromCart(product._id);
    } else {
      updateCart(product._id, newQuantity, product.stock);
    }
  };

  const handlePlus = () => {
    const newQuantity = quantity(product._id) + 1;
    if (newQuantity === 0) {
      removeFromCart(product._id);
    } else {
      updateCart(product._id, newQuantity, product.stock);
    }
  };

  return (
        <div key={product._id} className="product-card">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.imageUrl}
              alt={productName}
            />
          </Link>
          <div className="p-5">
            <div className="topline">
              <span>{categoryName}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label={
                    inWishlist(product._id)
                      ? t("common.removeFromWishlist")
                      : t("common.addToWishlist")
                  }
                  aria-pressed={inWishlist(product._id)}
                  onClick={() => requireAuth(() => handleWishlist())}
                >

                    <Heart
                      className={inWishlist(product._id) ? "fill-current" : ""}
                    />
                </button>
                  {inCart(product._id) ? (
                    <div
                      key="quantity"
                      className="quantity-bar"
                    >
                      <button onClick={() => handleMinus()}>
                        <Minus />
                      </button>

                      <div>{quantity(product._id)}</div>

                      <button onClick={() => handlePlus()} disabled={quantity(product._id) >= product.stock}>
                        <Plus />
                      </button>
                    </div>
                  ) : (
                    <button
                      key="cart"
                      type="button"
                      onClick={() => addToCart(product._id, 1, product.stock)}
                    >
                      <ShoppingBag />
                    </button>
                  )}
              </div>
            </div>
            <h3>{productName}</h3>
            <div className="details">
              <div className="rating">
                <Star />
                <span className="">{product.averageRating}</span>
              </div>
              <div className="price">
                {new Intl.NumberFormat(
                  currentLanguage === "en" ? "en-US" : "ar-EG-u-nu-latn",
                  {
                    style: "currency",
                    currency: product.currency,
                  },
                ).format(product.price)}
              </div>
            </div>
          </div>
        </div>
  );
}

export default ProductCard;
