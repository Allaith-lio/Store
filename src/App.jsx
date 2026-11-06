import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { MainLayout } from "./layouts/MainLayout";

import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";
import ShopProducts from "./pages/ShopProducts";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import Wishlist from "./pages/Wishlist";
import Products from "./pages/Products";
import { DashboardLayout } from "./layouts/DashboardLayout";
import {DashboardOverview} from "../src/dashboard/DashboardOverview";
import ProductsManagement from "./dashboard/ProductsManagement";
import OrderManagement from "./dashboard/OrderManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/products" element={<ShopProducts />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/product" element={<Products />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="/dashboard/products" element={<ProductsManagement />} />
        <Route path="/dashboard/orders" element={<OrderManagement />} />

        {/* put your components here and when you all finish delete this comment */}
      </Route>
    </Routes>
  );
}
export default App;
