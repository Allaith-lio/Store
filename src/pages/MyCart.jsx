import React from 'react'
import { ShoppingBag } from "lucide-react";
import CartSummary from "../components/cart/CartSummary";
import { useNavigate} from 'react-router-dom'
import { useShoppingCart } from "../context/CartContext";
import CarItem from "../components/cart/CarItem";
import { products } from "./ShopProducts";
const MyCart = () => {
    const navigate =useNavigate();
const { cartItems } = useShoppingCart();
const cartProducts = cartItems
  .map((item) => {
    return products.find((product) => product.id === item.id);
  })
  .filter(Boolean);

if (cartProducts.length === 0) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">

      <section className="mx-auto max-w-2xl py-8 text-center md:py-12">

        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-primary-text shadow-card">
          <ShoppingBag size={17} />
          Your shopping bag
        </span>

        <h1 className="mt-6 text-4xl font-bold text-ink">
          My <span className="font-logo logo-gradient">Cart...</span>
        </h1>

        <p className="mt-5 leading-8 text-muted">
          Your favorite finds are waiting for you.
        </p>

      </section>

      <div className="rounded-card border border-line bg-surface px-4 py-16 text-center shadow-card">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ShoppingBag size={34} className="text-primary" />
        </div>

        <h2 className="mt-6 text-xl font-bold text-ink">
          Your cart is empty
        </h2>

        <p className="mt-2 text-sm text-muted">
          Explore our products and find something you love.
        </p>

        <button
          type="button"
          onClick={() => navigate("/products")}
          className="btn btn-primary mt-6 h-12 gap-2 px-6"
        >
          <ShoppingBag size={19} />
          Browse products
        </button>

      </div>
    </div>
  );
}

return (
  <div className="mx-auto max-w-7xl px-4 py-10">
    <h1 className="mb-8 text-3xl font-bold text-ink">
      My Cart
    </h1>

    <div
      dir="ltr"
      className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"
    >
      {/* Products - Left Side */}
      <div className="flex flex-col gap-4">
        {cartProducts.map((product) => (
          <CarItem key={product.id} product={product} />
        ))}
      </div>

      {/* Order Summary - Right Side */}
      <div>
        <CartSummary products={cartProducts} />
      </div>
    </div>
  </div>
);

}

export default MyCart
