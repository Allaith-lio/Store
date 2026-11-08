
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

        <p className="text-primary-text font-bold">
          ${product.price.toFixed(2)}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => decreaseCartQuantity(product.id)}
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            onClick={() => increaseCartQuantity(product.id)}
          >
            +
          </button>

          <button
            type="button"
            onClick={() => RemoveItemFromCart(product.id)}
            className="ml-3 text-red-500"
          >
            Remove
          </button>
        </div>
      </div>

      <p className="font-bold">
        ${(product.price * quantity).toFixed(2)}
      </p>
    </div>
  );
};

export default CarItem;
