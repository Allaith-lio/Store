
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const { increaseCartQuantity } = useShoppingCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);

  const handleMoreDetails = (e) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[15px] border border-line bg-surface shadow-card transition duration-300 hover:scale-102 hover:shadow-lg">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-[5/3] w-full shrink-0 object-cover"
        />

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={
            isFavorite ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={isFavorite}
          className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-surface shadow-md transition hover:scale-110"
        >
          <Heart
            size={20}
            className={
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-muted"
            }
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-text">
          {product.category}
        </p>

        <h2 className="mt-2 text-lg leading-tight text-ink">
          {product.name}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm text-muted">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-primary-text">
            ${product.price.toFixed(2)}
          </span>

          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[grey]">
            <Star size={16} className="text-accent" fill="currentColor" />
            {product.rating}
          </span>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <button
            type="button"
            onClick={() => increaseCartQuantity(product.id)}
            className="btn btn-primary h-11 w-full whitespace-nowrap px-2 text-xs sm:px-3 sm:text-sm"
          >
            Add To Cart
          </button>

          <button
            type="button"
            onClick={handleMoreDetails}
            className="btn btn-outline flex h-11 w-full cursor-pointer items-center justify-center whitespace-nowrap px-2 text-xs sm:px-3 sm:text-sm"
          >
            More Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
