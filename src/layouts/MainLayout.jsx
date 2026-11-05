import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer"
import Header from "../components/layout/Header"
import { useLocation } from "react-router-dom";

export const MainLayout = () => { 
 const location = useLocation();
 const isProfilePage = location.pathname === "/profile";
  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

     {!isProfilePage && <Footer />}
    </div>
  )
}
