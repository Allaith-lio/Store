
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  ShoppingCart,
} from "lucide-react";

import { useShoppingCart } from "../context/CartContext";
import { products } from "../data/products";

import CartSummary from "../components/cart/CartSummary";
import CarItem from "../components/cart/CarItem";

const MyCart = () => {
  const navigate = useNavigate();

  const { cartItems, clearCart } = useShoppingCart();

  // Get full product details
  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.id);

      return product
        ? { ...product, quantity: item.quantity }
        : null;
    })
    .filter(Boolean);

  // Calculate total quantity
  const totalItems = cartProducts.reduce(
    (total, product) => total + product.quantity,
    0
  );

  // Clear all cart items
  const handleClearCart = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your cart?"
    );

    if (confirmed) {
      clearCart();
    }
  };

  // Empty Cart State
  if (cartProducts.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-card border border-line bg-surface px-5 py-12 text-center shadow-card">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingBag size={42} strokeWidth={1.5} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-ink">
            Your Cart is Empty
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            Looks like you haven't added anything to your cart yet.
            Explore our collection and find something you'll love!
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-7 flex h-12 items-center justify-center gap-2 rounded-control bg-primary px-7 font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <ShoppingBag size={19} />
            Browse Products
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary-text"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Page Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

        <div>
          <h1 className="lg:text-4xl">
            My{' '}
            <span className="font-logo logo-gradient text-[1.3em]">Shopping  </span>{' '}
            Cart
          </h1>

          <p className="mt-2 text-sm text-muted">
            You have {totalItems}{" "}
            {totalItems === 1 ? "item" : "items"} in your cart.
          </p>
        </div>

        {/* Clear Cart Button */}
        <button
          type="button"
          onClick={handleClearCart}
          className="flex items-center gap-2 rounded-control border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
        >
          <Trash2 size={17} />
          Clear Cart
        </button>

      </div>

      {/* Cart Content */}
      <div
        dir="ltr"
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-8"
      >

        {/* Cart Items */}
        <section className="min-w-0">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
            <ShoppingCart size={19} className="text-primary" />
            Cart Items ({cartProducts.length})
          </div>

          <div className="flex flex-col gap-4">
            {cartProducts.map((product) => (
              <CarItem
                key={product.id}
                product={product}
              />
            ))}
          </div>

          {/* Continue Shopping */}
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-6 flex items-center gap-2 text-sm font-semibold cursor-pointer text-primary-text transition-transform duration-300 hover:translate-x-1 "
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </button>
        </section>

        {/* Order Summary */}
        <aside className="lg:sticky lg:top-24">
          <CartSummary products={cartProducts} />
        </aside>

      </div>
    </main>
  );
};

export default MyCart;
