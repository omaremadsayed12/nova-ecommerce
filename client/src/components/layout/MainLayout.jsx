import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";

function MainLayout({ categories, loading }) {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer categories={categories} loading={loading} />
    </div>
  );
}

export default MainLayout;
