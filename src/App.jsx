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
import MyCart from "./pages/MyCart";
import CartContextProvider from "./context/CartContext";

function App() {
  return (
    <CartContextProvider>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/products" element={<ShopProducts />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/product" element={<Products />} />
        <Route path="/myCart" element={<MyCart />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
    </CartContextProvider>
  );
}
export default App;
