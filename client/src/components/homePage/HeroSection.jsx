import { Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HeroSection({
  t,
  currentLanguage,
  stats,
  carouselProducts,
  loadingStats,
  loadingCarouselProducts,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    if (carouselProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((current) => current + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselProducts.length]);

  return (
    <section className="hero-section">
      <div className="hero-shell">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">{t("home.heroSection.eyebrow")}</span>
            <h1>{t("home.heroSection.headline")}</h1>
            <p>{t("home.heroSection.paragraph")}</p>
            <div className="buttons">
              <Link to="/shop" className="btn-primary">
                {t("home.heroSection.primaryButton")}{" "}
              </Link>
            </div>
            <div className="stats">
              {loadingStats ? (
                <>
                  <div>
                    <div className="loading-stat" />
                    <div className="loading-stat-text" />
                  </div>
                  <div>
                    <div className="loading-stat" />
                    <div className="loading-stat-text" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="stat">{stats.totalOrders}</div>
                    <div>{t("home.heroSection.stats.orders")}</div>
                  </div>
                  <div>
                    <div className="stat">{stats.totalProducts}</div>
                    <div>{t("home.heroSection.stats.products")}</div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="slider-section">
              {loadingCarouselProducts ? (
                <div className="loading-slider"></div>
              ) : (
                <div className="slider">
                  <div
                    className={`flex ${isTransitioning ? "transitioning" : ""}`}
                    style={{
                      transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                    onTransitionEnd={() => {
                      if (currentSlide === carouselProducts.length - 1) {
                        setIsTransitioning(false);
                        setCurrentSlide(0);

                        requestAnimationFrame(() => {
                          requestAnimationFrame(() => {
                            setIsTransitioning(true);
                          });
                        });
                      }
                    }}
                  >
                    {carouselProducts.map((product, index) => (
                      <div key={`${product._id}-${index}`} className="products">
                        <img
                          src={product.imageUrl}
                          alt={product.name[currentLanguage]}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="slider-note">
              <div className="note">
                <div className="icon">
                  <Truck />
                </div>
                <div>
                  <div className="headline">
                    {t("home.heroSection.sliderNote.headline")}
                  </div>
                  <div className="info">
                    {t("home.heroSection.sliderNote.info")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
