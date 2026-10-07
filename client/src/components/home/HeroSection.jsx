import { ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function HeroSection({ stats, carouselProducts }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language === "ar" ? "ar" : "en";
  const [currentSlide, setCurrentSlide] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const hasInfiniteSlides = carouselProducts.length > 1;

  useEffect(() => {
    if (!hasInfiniteSlides) return undefined;
    const interval = window.setInterval(() => {
      setCurrentSlide((current) => current + 1);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [hasInfiniteSlides]);

  const slides = hasInfiniteSlides
    ? [carouselProducts[carouselProducts.length - 1], ...carouselProducts, carouselProducts[0]]
    : carouselProducts;
  const slideIndex = hasInfiniteSlides
    ? Math.min(currentSlide, carouselProducts.length + 1)
    : 0;

  const showPreviousSlide = () => {
    if (hasInfiniteSlides) setCurrentSlide((current) => Math.max(0, current - 1));
  };

  const showNextSlide = () => {
    if (hasInfiniteSlides) {
      setCurrentSlide((current) => Math.min(carouselProducts.length + 1, current + 1));
    }
  };

  const handleTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    if (currentSlide !== 0 && currentSlide !== carouselProducts.length + 1) return;

    setTransitionEnabled(false);
    setCurrentSlide(currentSlide === 0 ? carouselProducts.length : 1);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setTransitionEnabled(true));
    });
  };

  return (
    <section className="hero-section"><div className="hero-shell"><div className="hero-grid">
      <div><span className="eyebrow">{t("home.heroSection.eyebrow")}</span><h1>{t("home.heroSection.headline")}</h1><p>{t("home.heroSection.paragraph")}</p><div className="buttons"><Link to="/shop" className="btn-primary">{t("home.heroSection.primaryButton")}</Link></div><div className="stats"><div><div className="stat">{stats.totalOrders}</div><div>{t("home.heroSection.stats.orders")}</div></div><div><div className="stat">{stats.totalProducts}</div><div>{t("home.heroSection.stats.products")}</div></div></div></div>
      <div className="relative"><div className="slider-section"><div className="slider relative"><div onTransitionEnd={handleTransitionEnd} className={`flex ${transitionEnabled ? "transitioning" : ""}`} style={{ transform: `translateX(${currentLanguage === "ar" ? slideIndex * 100 : -slideIndex * 100}%)` }}>{slides.map((product, index) => <Link key={`${product._id}-${index}`} className="products" to={`/product/${product._id}`}><img src={product.imageUrl} alt={product.name?.[currentLanguage] || product.name?.en || t("common.featuredProduct")} /></Link>)}</div>{hasInfiniteSlides && <div className="absolute inset-x-3 bottom-3 z-10 flex justify-between"><button type="button" onClick={showPreviousSlide} aria-label={t("home.heroSection.previousSlide")} className="grid h-10 w-10 place-items-center rounded-full border border-(--line) bg-(--base)/90 text-(--ink) shadow-(--shadow-sm) backdrop-blur-sm"><span className="sr-only">{t("home.heroSection.previousSlide")}</span>{currentLanguage === "ar" ? <ChevronRight aria-hidden="true" /> : <ChevronLeft aria-hidden="true" />}</button><button type="button" onClick={showNextSlide} aria-label={t("home.heroSection.nextSlide")} className="grid h-10 w-10 place-items-center rounded-full border border-(--line) bg-(--base)/90 text-(--ink) shadow-(--shadow-sm) backdrop-blur-sm"><span className="sr-only">{t("home.heroSection.nextSlide")}</span>{currentLanguage === "ar" ? <ChevronLeft aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}</button></div>}</div></div><div className="slider-note"><div className="note"><div className="icon"><Truck /></div><div><div className="headline">{t("home.heroSection.sliderNote.headline")}</div><div className="info">{t("home.heroSection.sliderNote.info")}</div></div></div></div></div>
    </div></div></section>
  );
}

export default HeroSection;