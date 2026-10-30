import { Routes, Route } from "react-router-dom";
import { Home } from './pages/Home';
import { MainLayout } from './layouts/MainLayout';
import Products from './pages/Products';

function App() {
  return (
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Route>
      </Routes>
  )
}

export default App
