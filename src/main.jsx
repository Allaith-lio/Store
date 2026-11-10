import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx';
import  CartContextProvider  from './context/CartContext.jsx';
import WishlistProvider from "./context/WishlistContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CartContextProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
