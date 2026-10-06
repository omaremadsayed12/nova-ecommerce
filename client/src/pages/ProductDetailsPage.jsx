import { useContext, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/product.service";
import { CartContext } from "../context/CartContext";
import {  useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";

function localizedValue(value, language, fallback = "") {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || fallback;
}

function ProductDetailsPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language === "ar" ? "ar" : "en";
  const locale = currentLanguage === "ar" ? "ar-EG-u-nu-latn" : "en-US";
  const isRTL = currentLanguage === "ar";
  const { showError } = useToast();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [retryKey, setRetryKey] = useState(0);


  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return null;
      setLoading(true);
      setError(null);
      return getProductById(id, { signal: controller.signal });
    }).then((productData) => {
      if (active && productData) setProduct(productData.data);
    }).catch((requestError) => {
      if (active && requestError.name !== "CanceledError") setError(requestError.response?.data?.error?.message || t("productDetailsPage.loadError"));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
      controller.abort();
    };
  }, [id, retryKey, t]);

  const handleAddToCart = () => {
    try {
      setAddingToCart(true);
      addToCart(product._id, quantity, product.stock);
    } catch (err) {
      showError(
          err.response?.data?.error || t("common.loadingError")
        );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div role="status" className="p-20">{t("productDetailsPage.loading")}</div>;
  }

  if (error) {
    return <div className="p-20 text-red-600 dark:text-red-300"><p role="alert">{error}</p><button type="button" onClick={() => setRetryKey((key) => key + 1)} className="mt-4 font-bold underline">{t("common.tryAgain")}</button></div>;
  }

  if (!product) {
    return <div className="p-20">{t("productDetailsPage.notFound")}</div>;
  }

  const name = localizedValue(product.name, currentLanguage, t("common.product"));
  const category = localizedValue(product.category, currentLanguage);
  const description = localizedValue(product.description, currentLanguage);

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
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-(--muted)"
      >
        {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
        {t("productDetailsPage.shop")}
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">

        {/* Product image */}
        <div className="overflow-hidden rounded-[28px] border border-(--line) bg-(--base) p-3">
          <img
            src={product.imageUrl}
            alt={name}
            className="h-[420px] w-full rounded-[24px] object-cover sm:h-[520px] lg:h-[640px]"
          />
        </div>

        {/* Product information */}
        <div className="pt-2">

          <span className="text-xs font-bold uppercase tracking-[0.15em] text-(--muted)">
            {category}
          </span>

          <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-(--ink)">
            {name}
          </h1>


          <div className="mt-7 text-4xl font-black tracking-[-0.05em] text-(--ink)">
            {new Intl.NumberFormat(locale, {
              style: "currency",
              currency: product.currency,
            }).format(product.price)}
          </div>

          <p className="mt-6 text-base leading-7 text-(--muted)">
            {description}
          </p>

          {/* Quantity */}
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-5">
            <div className="inline-flex items-center gap-4 rounded-full border border-(--line) bg-(--base) px-3 py-2">
              <button
                onClick={decreaseQuantity}
                disabled={quantity === 1}
                aria-label={t("productDetailsPage.decrease")}
                className="rounded-full p-1 text-(--ink) hover:bg-(--panel-strong) disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="min-w-5 text-center font-bold text-(--ink)">
                {quantity}
              </span>

              <button
                onClick={increaseQuantity}
                disabled={quantity === product.stock}
                aria-label={t("productDetailsPage.increase")}
                className="rounded-full p-1 text-(--ink) hover:bg-(--panel-strong) disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="inline-flex items-center gap-3 rounded-full bg-(--ink) px-6 py-3 text-sm font-bold text-(--base) disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />

              {addingToCart ? t("productDetailsPage.adding") : t("productDetailsPage.addToCart")}
            </button>

            <button
              disabled={product.stock === 0}
              className="rounded-full border border-(--line) bg-(--base) px-6 py-3 text-sm font-bold text-(--ink) disabled:opacity-50"
            >
              {t("productDetailsPage.buyNow")}
            </button>
          </div>

          {/* Stock / shipping */}
          <div className="mt-8 rounded-[24px] border border-(--line) bg-(--panel) p-4 text-sm text-(--muted)">
            {product.stock > 0 ? (
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 p-2 text-emerald-700 dark:text-emerald-300">
                  ✓
                </span>

                {t("productDetailsPage.stockCount", { count: product.stock })}
              </div>
            ) : (
              <div className="text-red-600 dark:text-red-300">
                {t("productDetailsPage.outOfStock")}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
