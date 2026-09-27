import { ArrowLeft, ArrowRight} from "lucide-react"
import { Link } from "react-router-dom"
import ProductCard from "./ProductCard"

function Products({ t, currentLanguage, products}) {
    products = products
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 4);
  return (
    <section className="products-section">
          <div className="headline">
            <div>
              <span className="eyebrow">{t('home.productsSection.eyebrow')}</span>
              <h2>
                {t('home.productsSection.headline')}
              </h2>
            </div>
            <Link
              to="/shop"
            >
              {t('home.productsSection.link')} { currentLanguage == "en" ? <ArrowRight/> : <ArrowLeft/> }
            </Link>
          </div>
          <ProductCard currentLanguage={currentLanguage} products={products}/>
        </section>
  )
}

export default Products