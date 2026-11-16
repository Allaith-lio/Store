import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../../context/useShoppingCart";
import { useWishlist } from "../../context/WishlistContext";
import { useBranch } from "../../context/useBranch";
import { useToast } from "../../context/useToast";
import {
  getBranchesWithStock,
  getCatalogProducts,
  getProductStock,
  getStockStatus,
} from "../../services/branchService";

const stockStyles = {
  in: "bg-success/10 text-success-text",
  low: "bg-amber-500/10 text-amber-600",
  out: "bg-red-500/10 text-red-500",
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { increaseCartQuantity, getItemQuantity, clampCartToBranch } =
    useShoppingCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { selectedBranch, selectBranch } = useBranch();
  const { showToast } = useToast();

  const currentProduct =
    getCatalogProducts().find((item) => item.id === product.id) || product;
  const stock = getProductStock(currentProduct, selectedBranch.id);
  const status = getStockStatus(stock);
  const otherBranches =
    stock === 0 ? getBranchesWithStock(currentProduct, selectedBranch.id) : [];
  const isFavorite = isInWishlist(currentProduct.id);

  const goToDetails = () => navigate(`/products/${currentProduct.id}`);

  const handleMoreDetails = (e) => {
    e.stopPropagation();
    goToDetails();
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(currentProduct.id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (getItemQuantity(currentProduct.id) >= stock) {
      showToast(`Only ${stock} available at ${selectedBranch.name}`);
      return;
    }
    increaseCartQuantity(currentProduct.id);
    showToast(`${currentProduct.name} added to cart`);
  };

  const handleSwitchBranch = (e, branch) => {
    e.stopPropagation();
    selectBranch(branch.id);
    clampCartToBranch(branch.id);
    showToast(`Switched to ${branch.name}`);
  };

  return (
    <div
      onClick={goToDetails}
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[15px] border border-line bg-surface shadow-card transition duration-300 hover:shadow-lg"
    >
      <div className="relative overflow-hidden">
        <img
          src={currentProduct.image?.replace("w=1200", "w=600")}
          alt={currentProduct.name}
          loading="lazy"
          className={`aspect-[5/3] w-full shrink-0 object-cover transition duration-300 ${
            stock === 0 ? "opacity-60 grayscale" : ""
          }`}
        />

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isFavorite}
          className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-surface shadow-md transition hover:scale-110"
        >
          <Heart
            size={20}
            className={isFavorite ? "fill-red-500 text-red-500" : "text-muted"}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-text">
          {currentProduct.category}
        </p>

        <h2 className="mt-2 text-lg leading-tight text-ink">
          {currentProduct.name}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm text-muted">
          {currentProduct.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-primary-text">
            ${currentProduct.price.toFixed(2)}
          </span>

          <span className="inline-flex items-center gap-1 text-sm font-semibold text-muted">
            <Star size={16} className="text-accent" fill="currentColor" />
            {currentProduct.rating}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stockStyles[status.key]}`}
          >
            {status.label}
          </span>
          <span className="text-xs text-muted">at {selectedBranch.name}</span>
        </div>

        {stock === 0 && otherBranches.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span>Available at:</span>
            {otherBranches.map((branch) => (
              <button
                key={branch.id}
                type="button"
                onClick={(e) => handleSwitchBranch(e, branch)}
                className="cursor-pointer rounded-full border border-line px-2.5 py-1 font-semibold text-primary-text transition-colors hover:border-primary"
              >
                {branch.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="btn btn-primary h-11 w-full whitespace-nowrap px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
          >
            {stock > 0 ? "Add To Cart" : "Sold Out"}
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