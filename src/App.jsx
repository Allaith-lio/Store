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
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardOverview } from "./dashboard/DashboardOverview";
import ProductsManagement from "./dashboard/ProductsManagement";
import OrderManagement from "./dashboard/OrderManagement";
import Checkout from "./pages/CheckoutPage";
import ProductPage from "./components/Product/ProductPage";
import MyCart from "./pages/MyCart";
import CartContextProvider from "./context/CartContext";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <CartContextProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/products" element={<ShopProducts />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/myCart" element={<MyCart />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
      </Routes>
    </CartContextProvider>
  );
}

export default App;
