import { useState } from "react";
import { Heart, Star } from "lucide-react";

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
      return saved.includes(product.id);
    } catch {
      return false;
    }
  });

  const toggleFavorite = (e) => {
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
      let nextWishlist;

      if (saved.includes(product.id)) {
        nextWishlist = saved.filter((id) => id !== product.id);
      } else {
        nextWishlist = [...saved, product.id];
      }

      localStorage.setItem("wishlist", JSON.stringify(nextWishlist));
      window.dispatchEvent(new Event("wishlistChanged"));
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating wishlist", error);
    }
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
          aria-label={
            isFavorite
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={toggleFavorite}
          className="cursor-pointer absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/80 transition hover:scale-105"
        >
          <Heart
            size={18}
            className={isFavorite ? "text-primary" : "text-ink"}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {product.category}
        </p>
        <h2 className="mt-2 text-lg leading-tight text-ink">{product.name}</h2>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-primary">
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
            className="btn btn-primary h-11 w-full whitespace-nowrap px-2 text-xs sm:px-3 sm:text-sm"
          >
            Add To Cart
          </button>
          <button
            type="button"
            className="btn btn-outline h-11 w-full whitespace-nowrap px-2 text-xs sm:px-3 sm:text-sm"
          >
            More Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;