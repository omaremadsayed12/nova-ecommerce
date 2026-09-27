import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";

function ProductCard({ currentLanguage, products }) {
  const { inCart, addToCart, removeFromCart, updateCart, quantity } =
    useContext(CartContext);
  const { inWishlist, addProductToWishlist, removeProductFromWishlist } =
    useContext(WishlistContext);
  const { requireAuth } = useContext(AuthContext);

  const handleWishlist = (productId) => {
    if (inWishlist(productId)) {
      removeProductFromWishlist(productId);
    } else {
      addProductToWishlist(productId);
    }
  };

  const handleMinus = (productId) => {
    const newQuantity = quantity(productId) - 1;
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateCart(productId, newQuantity);
    }
  };

  const handlePlus = (productId) => {
    const newQuantity = quantity(productId) + 1;
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateCart(productId, newQuantity);
    }
  };

  return (
    <div className="product-card">
      {products.map((product) => (
        <div key={product._id} className="card-surface overflow-hidden">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.imageUrl}
              alt={product.name[currentLanguage]}
            />
          </Link>
          <div className="p-5">
            <div className="topline">
              <span>{product.category[currentLanguage]}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label={
                    inWishlist(product._id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  aria-pressed={inWishlist(product._id)}
                  onClick={() => requireAuth(() => handleWishlist(product._id))}
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
                      <button onClick={() => handleMinus(product._id)}>
                        <Minus />
                      </button>

                      <div>{quantity(product._id)}</div>

                      <button onClick={() => handlePlus(product._id)}>
                        <Plus />
                      </button>
                    </div>
                  ) : (
                    <button
                      key="cart"
                      type="button"
                      onClick={() => addToCart(product._id, 1)}
                    >
                      <ShoppingBag />
                    </button>
                  )}
              </div>
            </div>
            <h3>{product.name[currentLanguage]}</h3>
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
      ))}
    </div>
  );
}

export default ProductCard;
