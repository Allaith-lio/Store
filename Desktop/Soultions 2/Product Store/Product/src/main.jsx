import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import Products from "./components/Products.jsx";
import Footer from "./components/Footer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Header />
    <Home />
    <Products />
    <Footer />
  </StrictMode>,
);
