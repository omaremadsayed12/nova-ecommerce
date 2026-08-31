import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
