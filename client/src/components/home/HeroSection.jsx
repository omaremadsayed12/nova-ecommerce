import { Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function HeroSection({ stats, carouselProducts }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language === "ar" ? "ar" : "en";
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (carouselProducts.length <= 1) return undefined;
    const interval = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % carouselProducts.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [carouselProducts.length]);

  return (
    <section className="hero-section"><div className="hero-shell"><div className="hero-grid">
      <div><span className="eyebrow">{t("home.heroSection.eyebrow")}</span><h1>{t("home.heroSection.headline")}</h1><p>{t("home.heroSection.paragraph")}</p><div className="buttons"><Link to="/shop" className="btn-primary">{t("home.heroSection.primaryButton")}</Link></div><div className="stats"><div><div className="stat">{stats.totalOrders}</div><div>{t("home.heroSection.stats.orders")}</div></div><div><div className="stat">{stats.totalProducts}</div><div>{t("home.heroSection.stats.products")}</div></div></div></div>
      <div className="relative"><div className="slider-section"><div className="slider"><div className="flex transitioning" style={{ transform: `translateX(${currentLanguage === "ar" ? currentSlide * 100 : -currentSlide * 100}%)` }}>{carouselProducts.map((product) => <Link key={product._id} className="products" to={`/product/${product._id}`}><img src={product.imageUrl} alt={product.name?.[currentLanguage] || product.name?.en || "Featured product"} /></Link>)}</div></div></div><div className="slider-note"><div className="note"><div className="icon"><Truck /></div><div><div className="headline">{t("home.heroSection.sliderNote.headline")}</div><div className="info">{t("home.heroSection.sliderNote.info")}</div></div></div></div></div>
    </div></div></section>
  );
}

export default HeroSection;