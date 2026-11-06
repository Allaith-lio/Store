
import { useShoppingCart } from "../../context/CartContext";

const CartSummary = ({ products }) => {
  const { getItemQuantity } = useShoppingCart();

  const totalItems = products.reduce((total, product) => {
    return total + getItemQuantity(product.id);
  }, 0);

  const subtotal = products.reduce((total, product) => {
    return total + product.price * getItemQuantity(product.id);
  }, 0);

  return (
    <div className="rounded-xl border border-line bg-surface p-6 shadow-card">
      <h2 className="mb-6 text-xl font-bold text-ink">
        Order Summary
      </h2>

      <div className="flex justify-between py-3 text-muted">
        <span>Items ({totalItems})</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between border-t border-line py-4 text-lg font-bold text-ink">
        <span>Total</span>
        <span className="text-primary-text">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      <button
        type="button"
        className="btn btn-primary mt-4 h-12 w-full"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
