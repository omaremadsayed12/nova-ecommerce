import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/product.service";
import { addToCart } from "../services/cart.service";
import LoginModal from "../components/auth/LoginModal";
import useToast from "../hooks/useToast";

function ProductDetailsPage() {
  const { id } = useParams();
  const { showError } = useToast();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);


  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.data);
      } catch (err) {
        setError("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

      await addToCart(product._id, quantity);

      console.log("Product added to cart");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 400) {
        setShowAuthModal(true);
        return;
      }
      console.error("Failed to add product:", err);
      showError(
          err.response?.data?.error || "Something went wrong"
        );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="p-20">Loading product...</div>;
  }

  if (error) {
    return <div className="p-20 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="p-20">Product not found.</div>;
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-6 md:px-20">

      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-slate-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Shop
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">

        {/* Product image */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-[640px] w-full rounded-[24px] object-cover"
          />
        </div>

        {/* Product information */}
        <div className="pt-2">

          <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
            {product.category}
          </span>

          <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-slate-900">
            {product.name}
          </h1>


          <div className="mt-7 text-4xl font-black tracking-[-0.05em] text-slate-900">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: product.currency,
            }).format(product.price)}
          </div>

          <p className="mt-6 text-base leading-7 text-slate-600">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="mt-8 flex items-center gap-5">
            <div className="inline-flex items-center gap-4 rounded-full border border-slate-200 bg-white px-3 py-2">
              <button
                onClick={decreaseQuantity}
                disabled={quantity === 1}
                className="rounded-full p-1 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="min-w-5 text-center font-bold text-slate-900">
                {quantity}
              </span>

              <button
                onClick={increaseQuantity}
                disabled={quantity === product.stock}
                className="rounded-full p-1 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="inline-flex items-center gap-3 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />

              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <button
              disabled={product.stock === 0}
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>

          {/* Stock / shipping */}
          <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {product.stock > 0 ? (
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                  ✓
                </span>

                {product.stock} available in stock
              </div>
            ) : (
              <div className="text-red-600">
                Out of stock
              </div>
            )}
          </div>

        </div>
      </div>
      <LoginModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default ProductDetailsPage;