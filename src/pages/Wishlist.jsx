
import { Heart, HeartIcon, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "../components/Product/ProductCard";
import { products } from "../data/products";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const { wishlistIds, wishlistCount, clearWishlist } = useWishlist();

  const wishlistProducts = products.filter((product) =>
    wishlistIds.includes(product.id)
  );

  const handleClearWishlist = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your wishlist?"
    );

    if (confirmed) {
      clearWishlist();
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Page Header */}
      <section className="mx-auto max-w-2xl py-8 text-center md:py-16">

        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-primary shadow-card">
          <HeartIcon size={17} className="text-accent" />
          Saved for later
        </span>

        <h1 className="mt-6 text-3xl font-bold text-ink sm:text-4xl">
          My{" "}
          <span className="font-logo logo-gradient">
            Wishlist...
          </span>
        </h1>

        <p className="mt-5 leading-8 text-muted">
          All your favorite products, gathered in one place.
        </p>

      </section>

      {/* Wishlist Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">

        <p className="text-sm text-muted">
          Showing{" "}
          <span className="font-bold text-ink">
            {wishlistCount}
          </span>{" "}
          {wishlistCount === 1 ? "product" : "products"}
        </p>

        {wishlistCount > 0 && (
          <button
            type="button"
            onClick={handleClearWishlist}
            className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-red-500 transition-colors hover:text-red-600"
          >
            <Trash2 size={16} />
            Clear Wishlist
          </button>
        )}

      </div>

      {/* Wishlist Products */}
      {wishlistProducts.length > 0 ? (

        <div className="mt-6 grid grid-cols-1 gap-5 min-[451px]:grid-cols-2 min-[791px]:grid-cols-3 min-[1024px]:grid-cols-4">

          {wishlistProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      ) : (

        /* Empty Wishlist */
        <div className="mt-6 rounded-card border border-line bg-surface px-4 py-16 text-center shadow-card">

          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Heart size={30} />
          </span>

          <h2 className="mt-5 text-xl font-bold text-ink">
            Your Wishlist is Empty
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Explore our products and save the items you love.
            They'll be waiting for you here!
          </p>

          <Link
            to="/products"
            className="btn btn-primary mt-6 inline-flex cursor-pointer items-center gap-2 no-underline"
          >
            <ShoppingBag size={19} />
            Browse Products
          </Link>

        </div>

      )}

    </main>
  );
};

export default Wishlist;
