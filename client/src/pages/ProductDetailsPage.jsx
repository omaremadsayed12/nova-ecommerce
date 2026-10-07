import { useContext, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  Star,
  ShoppingCart,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getProductById, getRelatedProducts } from "../services/product.service";
import { addProductReview, getMyProductReview, getProductReviews } from "../services/reviews.service";
import { CartContext } from "../context/CartContext";
import {  useToast } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";
import ShopProductCard from "../components/shop/ShopProductCard";
import ShopProductCardSkeleton from "../components/shop/Skeletons/ShopProductCardSkeleton";
import { getApiErrorMessage } from "../services/apiError";
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
  const { isAuthenticated, openAuth } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [relatedError, setRelatedError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewMeta, setReviewMeta] = useState({ page: 1, totalPages: 0, total: 0, averageRating: 0 });
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState("");
  const [reviewRating, setReviewRating] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [myReview, setMyReview] = useState(null);
  const [myReviewLoading, setMyReviewLoading] = useState(false);
  const [myReviewError, setMyReviewError] = useState("");
  const [myReviewRetry, setMyReviewRetry] = useState(0);


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
      if (active && requestError.name !== "CanceledError") setError(getApiErrorMessage(requestError, t, "productDetailsPage.loadError"));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
      controller.abort();
    };
  }, [id, retryKey, t]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return null;
      setRelatedLoading(true);
      setRelatedError("");
      return getRelatedProducts(id, { limit: 4 }, { signal: controller.signal });
    }).then((response) => {
      if (active && response) setRelatedProducts(response.data || []);
    }).catch((requestError) => {
      if (active && requestError.name !== "CanceledError") {
        setRelatedError(getApiErrorMessage(requestError, t, "productDetailsPage.relatedError"));
      }
    }).finally(() => {
      if (active) setRelatedLoading(false);
    });
    return () => {
      active = false;
      controller.abort();
    };
  }, [id, retryKey, t]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    if (!isAuthenticated) {
      return () => {
        active = false;
        controller.abort();
      };
    }

    Promise.resolve()
      .then(() => {
        if (!active) return null;
        setMyReview(null);
        setMyReviewError("");
        setMyReviewLoading(true);
        return getMyProductReview(id, { signal: controller.signal });
      })
      .then((review) => {
        if (active) setMyReview(review);
      })
      .catch((requestError) => {
        if (active && requestError.name !== "CanceledError") {
          setMyReviewError(getApiErrorMessage(requestError, t, "productDetailsPage.myReviewError"));
        }
      })
      .finally(() => {
        if (active) setMyReviewLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [id, isAuthenticated, myReviewRetry, t]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return null;
      setReviewLoading(true);
      setReviewError("");
      return getProductReviews(id, { page: reviewPage, limit: 5 }, { signal: controller.signal });
    }).then((response) => {
      if (active && response) {
        setReviews(response.data || []);
        setReviewMeta(response.meta || { page: 1, totalPages: 0, total: 0, averageRating: 0 });
      }
    }).catch((requestError) => {
      if (active && requestError.name !== "CanceledError") {
        setReviewError(getApiErrorMessage(requestError, t, "productDetailsPage.reviewsError"));
      }
    }).finally(() => {
      if (active) setReviewLoading(false);
    });
    return () => {
      active = false;
      controller.abort();
    };
  }, [id, reviewPage, reviewRefresh, t]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      openAuth();
      return;
    }
    if (!reviewRating) return;

    try {
      setReviewSubmitting(true);
      const createdReview = await addProductReview(id, { rating: Number(reviewRating), comment: reviewComment.trim() });
      setMyReview(createdReview);
      setReviewRating("");
      setReviewComment("");
      setReviewPage(1);
      setReviewRefresh((current) => current + 1);
    } catch (requestError) {
      setReviewError(getApiErrorMessage(requestError, t, "productDetailsPage.reviewSubmitError"));
    } finally {
      setReviewSubmitting(false);
    }
  };

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
          {product.stock > 0 && product.stock <= 5 && (
            <div className="mt-8 rounded-[24px] border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              <div className="flex items-center gap-3">
                {t("productDetailsPage.lowStock", { count: product.stock })}
              </div>
            </div>
          )}
          {product.stock === 0 && (
            <div className="mt-8 rounded-[24px] border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {t("productDetailsPage.outOfStock")}
            </div>
          )}

        </div>
      </div>

      <section className="mt-16 border-t border-(--line) pt-10" aria-labelledby="product-reviews-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="product-reviews-heading" className="text-3xl font-black text-(--ink)">{t("productDetailsPage.reviewsTitle")}</h2>
            <p className="mt-2 flex items-center gap-2 text-(--muted)">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-(--ink)">{reviewMeta.averageRating}</span>
              <span>{t("productDetailsPage.reviewCount", { count: reviewMeta.total })}</span>
            </p>
          </div>
        </div>

        {!isAuthenticated ? (
          <button type="button" onClick={openAuth} className="mt-6 rounded-full border border-(--line) px-5 py-3 font-bold text-(--ink)">{t("productDetailsPage.signInToReview")}</button>
        ) : myReviewLoading ? (
          <p role="status" className="mt-6 rounded-2xl bg-(--base) p-5 text-(--muted)">{t("productDetailsPage.myReviewLoading")}</p>
        ) : myReviewError ? (
          <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            <p>{myReviewError}</p>
            <button type="button" onClick={() => setMyReviewRetry((value) => value + 1)} className="mt-2 font-bold underline">{t("common.tryAgain")}</button>
          </div>
        ) : myReview ? (
          <article className="mt-6 rounded-3xl border border-(--line) bg-(--base) p-5">
            <h3 className="font-bold text-(--ink)">{t("productDetailsPage.yourReview")}</h3>
            <p className="mt-2 flex items-center gap-2 text-(--muted)">
              <span className="flex items-center gap-1 text-amber-500" aria-label={t("productDetailsPage.ratingOption", { count: myReview.rating })}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < myReview.rating ? "fill-current" : ""}`} />)}</span>
              <span>{t("productDetailsPage.reviewedOn", { date: new Date(myReview.createdAt).toLocaleDateString(locale) })}</span>
            </p>
            {myReview.comment && <p className="mt-3 whitespace-pre-wrap text-(--ink)">{myReview.comment}</p>}
          </article>
        ) : (
          <form onSubmit={submitReview} className="mt-6 grid gap-4 rounded-3xl border border-(--line) bg-(--base) p-5">
            <label className="grid gap-2 text-sm font-semibold text-(--ink)">
              {t("productDetailsPage.ratingLabel")}
              <select required value={reviewRating} onChange={(event) => setReviewRating(event.target.value)} className="min-h-11 rounded-xl border border-(--line) bg-(--panel) px-3">
                <option value="">{t("productDetailsPage.chooseRating")}</option>
                {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{t("productDetailsPage.ratingOption", { count: rating })}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-(--ink)">
              {t("productDetailsPage.reviewComment")}
              <textarea maxLength={225} rows={3} value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} className="rounded-xl border border-(--line) bg-(--panel) p-3" />
            </label>
            <button type="submit" disabled={reviewSubmitting || !reviewRating} className="justify-self-start rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base) disabled:opacity-50">{reviewSubmitting ? t("productDetailsPage.reviewSubmitting") : t("productDetailsPage.submitReview")}</button>
          </form>
        )}
        {reviewError && <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-300">{reviewError}</p>}
        {reviewLoading ? <p role="status" className="mt-6 rounded-2xl bg-(--base) p-5 text-(--muted)">{t("productDetailsPage.reviewsLoading")}</p> : reviews.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-(--line) bg-(--base) p-5 text-(--muted)">{t("productDetailsPage.noReviews")}</p>
        ) : (
          <div className="mt-6 space-y-3">{reviews.map((review) => (
            <article key={review._id} className="rounded-2xl border border-(--line) bg-(--base) p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1 text-amber-500" aria-label={t("productDetailsPage.ratingOption", { count: review.rating })}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-current" : ""}`} />)}</span>
                <time className="text-xs text-(--muted)" dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString(locale)}</time>
              </div>
              {review.comment && <p className="mt-3 whitespace-pre-wrap text-(--ink)">{review.comment}</p>}
            </article>
          ))}</div>
        )}
        {!reviewLoading && reviewMeta.totalPages > 1 && <nav className="mt-5 flex items-center justify-between" aria-label={t("productDetailsPage.reviewsPagesLabel")}><button type="button" disabled={reviewPage <= 1} onClick={() => setReviewPage((page) => page - 1)} className="rounded-full border border-(--line) px-4 py-2 font-semibold text-(--ink) disabled:opacity-40">{t("productDetailsPage.previous")}</button><span className="text-sm text-(--muted)">{t("productDetailsPage.page", { page: reviewMeta.page, pages: reviewMeta.totalPages })}</span><button type="button" disabled={reviewPage >= reviewMeta.totalPages} onClick={() => setReviewPage((page) => page + 1)} className="rounded-full border border-(--line) px-4 py-2 font-semibold text-(--ink) disabled:opacity-40">{t("productDetailsPage.next")}</button></nav>}
      </section>

      <section className="mt-16 border-t border-(--line) pt-10" aria-labelledby="related-products-heading">
        <h2 id="related-products-heading" className="mb-6 text-3xl font-black text-(--ink)">{t("productDetailsPage.relatedTitle")}</h2>
        {relatedError ? (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">{relatedError}</p>
        ) : relatedLoading ? (
          <div role="status" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><span className="sr-only">{t("productDetailsPage.relatedLoading")}</span>{Array.from({ length: 4 }, (_, index) => <ShopProductCardSkeleton key={index} />)}</div>
        ) : relatedProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{relatedProducts.map((relatedProduct) => <ShopProductCard key={relatedProduct._id} product={relatedProduct} />)}</div>
        ) : (
          <p className="rounded-2xl border border-(--line) bg-(--base) p-5 text-(--muted)">{t("productDetailsPage.relatedEmpty")}</p>
        )}
      </section>
    </div>
  );
}

export default ProductDetailsPage;
