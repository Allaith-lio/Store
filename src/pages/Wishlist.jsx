import { useState, useEffect } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/Product/ProductCard";
import { products } from "./ShopProducts";

const Wishlist = () => {
    const [wishlistIds, setWishlistIds] = useState(() => {
        const saved = localStorage.getItem("wishlist");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const saved = localStorage.getItem("wishlist");
            setWishlistIds(saved ? JSON.parse(saved) : []);
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("wishlistChanged", handleStorageChange);
    }, []);

    const wishlistProducts = products.filter((product) => 
        wishlistIds.includes(product.id)
    );

    const clearWishlist = () => {
        localStorage.removeItem("wishlist");
        setWishlistIds([]);
    };
    return (
        <div className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <header className="text-center">
                <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    Saved for later
                </span>
                <h1 className="mt-2 text-ink">My Wishlist</h1>
                <p className="mt-3 leading-7 text-[grey] sm:text-lg">
                    All your favorite products, gathered in one place.
                </p>
            </header>

            <div className="mt-8 flex items-center justify-between gap-4">
                <p className="text-sm text-[grey]">
                    Showing{" "}
                    <span className="font-bold text-ink">{wishlistProducts.length}</span>{" "}
                    {wishlistProducts.length === 1 ? "product" : "products"}
                </p>

                {wishlistProducts.length > 0 && (
                    <button
                        type="button"
                        onClick={clearWishlist}
                        className="cursor-pointer text-sm font-semibold text-primary hover:text-primary-hover"
                    >
                        Clear wishlist
                    </button>
                )}
            </div>

            {wishlistProducts.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-5 min-[451px]:grid-cols-2 min-[791px]:grid-cols-3 min-[1024px]:grid-cols-4">
                    {wishlistProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="mt-5 rounded-card border border-line bg-surface px-4 py-16 text-center shadow-card">
                    <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Heart size={30} />
                    </span>
                    <h2 className="mt-5 text-xl text-ink">Your wishlist is empty</h2>
                    <p className="mt-2 text-sm text-[grey]">
                        Explore our products and save the items you love.
                    </p>
                    <Link
                        to="/products"
                        className="btn btn-primary mt-5 no-underline"
                    >
                        <ShoppingBag size={20} />
                        Browse products
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Wishlist;