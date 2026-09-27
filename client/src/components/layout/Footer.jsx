import { Link } from "react-router-dom";
import Container from "./Container";
import { Mail, Phone } from "lucide-react";

function Footer({ categories, loading,loadingFailed, t }) {

categories = categories.slice(0,4)

  const handleNavClick = (to) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (location.pathname === to) {
      window.location.reload();
    }
  };

  if (loading || loadingFailed) {
    categories = [
      {
        name: "Home Page"
      },
      {
        name: "Store"
      },
      {
        name: "Arsenal"
      },
      {
        name: "About Us"
      },
    ] 
  }

  return (
    <footer>
      <Container className="py-12">
        <div className="upper__footer">
          <div>
            <div className="logo">{t("footer.upperFooter.logo")}</div>
            <p>{t("footer.upperFooter.paragraph")} </p>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <h3>{t("footer.upperFooter.explore")}</h3>
                <ul>
                  {categories.map((category,index) => {                    
                    return (
                      <li key={index}>
                        <Link to="/shop" onClick={()=> handleNavClick("/shop")}>{category["name"]}</Link>
                      </li>
                    );
                  })}
                </ul>
            </div>

            <div>
              <h3>{t("footer.upperFooter.contactUs")}</h3>
              <ul className="h-full flex justify-between content-center pt-4 pb-12">
                <li>
                  <Link to="tel:+201001111000">
                    <Phone />
                    <div dir="ltr">+20 100 1111 000</div>
                  </Link>
                </li>
                <li>
                  <Link to="mailto:contact@nova.eg">
                    <Mail />
                    <div dir="ltr">contact@nova.eg</div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="lower__footer">
          <p>{t("footer.lowerFooter.paragraph")}</p>
          <div className="flex flex-wrap">
            <Link to="/privacy-policy">
              {t("footer.lowerFooter.privacyPolicy")}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
