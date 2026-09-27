import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";

function MainLayout({ categories, loading, t, currentLanguage }) {
  return (
    <div className="main-layout">
      <Navbar currentLanguage={currentLanguage} />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer categories={categories} loading={loading} t={t} currentLanguage={currentLanguage} />
    </div>
  );
}

export default MainLayout;
