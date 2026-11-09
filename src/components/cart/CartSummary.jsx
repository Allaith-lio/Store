
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Truck } from "lucide-react";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

const CartSummary = ({ products }) => {
  const navigate = useNavigate();

  const itemCount = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const subTotal = products.reduce(
    (total, product) =>
      total + Number(product.price) * product.quantity,
    0
  );

  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-control bg-primary/10 text-primary">
          <ShoppingBag size={21} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-ink">
            Order Summary
          </h2>
          <p className="text-sm text-muted">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </div>

      {/* Price Details */}
      <div className="space-y-4 border-b border-line pb-5">
        <div className="flex justify-between gap-3 text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-semibold text-ink">
            {formatPrice(subTotal)}
          </span>
        </div>

        <div className="flex justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-muted">
            <Truck size={16} />
            Shipping
          </span>
          <span className="text-success-text font-bold">
            Free
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between gap-3 py-5">
        <span className="font-bold text-ink">
          Estimated Total
        </span>

        <span className="text-2xl font-bold text-primary-text">
          {formatPrice(subTotal)}
        </span>
      </div>

      <p className="mb-5 text-xs text-muted">
        Shipping fees and any applicable taxes will be calculated
        during checkout.
      </p>

      {/* Checkout Button */}
      <button
        type="button"
        onClick={() => navigate("/checkout")}
        className="btn btn-primary w-full h-11"
      >
        Proceed to Checkout
        <ArrowRight size={18} />
      </button>

      <button
        type="button"
        onClick={() => navigate("/products")}
        className="btn btn-outline mt-3 h-11 w-full "
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default CartSummary;
