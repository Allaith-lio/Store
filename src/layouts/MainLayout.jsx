import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

export const MainLayout = () => {
  const location = useLocation();
  const isCheckout = location.pathname === "/checkout";
  const isProfilePage = location.pathname === "/profile";

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <Header showLinks={!isCheckout} />

      <main className="flex-1">
        <Outlet />
      </main>

      {!isProfilePage && <Footer showCards={!isCheckout} />}
    </div>
  );
};
