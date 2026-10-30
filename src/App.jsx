import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { MainLayout } from "./layouts/MainLayout";
import Products from "./pages/Products";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Products />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
