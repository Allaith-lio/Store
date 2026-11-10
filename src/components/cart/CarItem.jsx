
import { Minus, Plus, Trash2 } from "lucide-react";
import { useShoppingCart } from "../../context/CartContext";

const CarItem = ({ product }) => {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    RemoveItemFromCart,
  } = useShoppingCart();

  const quantity = getItemQuantity(product.id);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4">

      <img
        src={product.image}
        alt={product.name}
        className="h-24 w-24 rounded-lg object-cover"
      />

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="font-semibold text-ink">
          {product.name}
        </h3>

        <p className="font-bold text-primary-text">
          ${product.price.toFixed(2)}
        </p>

        <div className="flex flex-wrap items-center gap-3">

          {/* Decrease Quantity */}
          <button
            type="button"
            onClick={() => decreaseCartQuantity(product.id)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-control border border-line text-ink transition-colors hover:bg-page disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus size={15} />
          </button>

          <span className="min-w-5 text-center font-semibold text-ink">
            {quantity}
          </span>

          {/* Increase Quantity */}
          <button
            type="button"
            onClick={() => increaseCartQuantity(product.id)}
            aria-label="Increase quantity"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-control border border-line text-ink transition-colors hover:bg-page"
          >
            <Plus size={15} />
          </button>

          {/* Remove Product */}
          <button
            type="button"
            onClick={() => RemoveItemFromCart(product.id)}
            className="ml-3 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
          >
            <Trash2 size={16} />
            Remove
          </button>

        </div>
      </div>

      {/* Item Total */}
      <p className="font-bold text-ink">
        ${(product.price * quantity).toFixed(2)}
      </p>

    </div>
  );
};

export default CarItem;