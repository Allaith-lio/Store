import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  UserRound,
  UserRoundPlus,
  ShoppingCart,
  Moon,
  Sun,
  ArrowLeft,
} from "lucide-react";
import HeaderDrawers from "./HeaderDrawers";
import Button from "../common/Button";
import NavbarLinks from "../common/NavbarLinks";
import { useTheme } from "../../context/ThemeContext";
import { useShoppingCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { products } from "../../data/products";
import { Logo } from "../common/Logo";

export default function Header({ showLinks = true }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const {cartItems: contextCartItems, updateCartQuantity, RemoveItemFromCart } = useShoppingCart();

  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 991px)").matches,
  );

  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const isLoggedIn = true;
  
  const cartItems = contextCartItems.map((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return null;
    return {
      ...product,
      id: item.id,
      name: product.name ?? product.title,
      image: product.image ?? product.thumbnail,
      quantity: item.quantity,
    };
  }).filter(Boolean);

  const cartCount = contextCartItems.reduce((total, item) => total + item.quantity, 0);

  const subTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const handleQtyChange = (id, quantity) => {updateCartQuantity(id, quantity);};
  const handleRemoveItem = (id) => {RemoveItemFromCart(id)};

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 991px)");

    const handleScreenChange = (event) => {
      setIsMobile(event.matches);

      if (!event.matches) {
        setShowMenu(false);
      }
    };

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-surface shadow-card">
        <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
          {showLinks && isMobile && (
            <button
              type="button"
              onClick={() => setShowMenu(true)}
              aria-label="Open navigation menu"
              aria-expanded={showMenu}
              className="shrink-0 rounded-control p-2 text-ink transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Menu size={25} />
            </button>
          )}

          <Logo />

          {!showLinks && (
            <Link
              to="/myCart"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition-colors hover:text-primary-text"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Back to Cart
            </Link>
          )}

          {showLinks && !isMobile && (
            <NavbarLinks
              variant="desktop"
              isLoggedIn={isLoggedIn}
              wishlistCount={wishlistCount}
              cartCount={cartCount}
              onOpenCart={() => setShowCart(true)}
              onOpenProfile={() => navigate("/profile")}
            />
          )}

          {showLinks && isMobile && (
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <Button
                type="button"
                className="icon-link relative"
                ariaLabel={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
                onClick={toggleTheme}
              >
                {isDarkMode ? (
                  <Sun size={22} className="text-amber-400" />
                ) : (
                  <Moon size={22} />
                )}
              </Button>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  aria-label="Open profile"
                  className="rounded-control p-2 text-ink hover:bg-page"
                >
                  <UserRound size={22} />
                </button>
              ) : (
                <Link
                  to="/login"
                  aria-label="Register"
                  className="rounded-control p-2 text-ink hover:bg-page"
                >
                  <UserRoundPlus size={22} />
                </Link>
              )}

              <Button
                type="button"
                className="relative rounded-control p-2 text-primary-text hover:bg-page"
                ariaLabel={`Open cart, ${cartCount} items`}
                onClick={() => setShowCart(true)}
              >
                <ShoppingCart size={24} />

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </header>

      {showLinks && (
        <HeaderDrawers
          showMenu={showMenu}
          onCloseMenu={() => setShowMenu(false)}
          showCart={showCart}
          onCloseCart={() => setShowCart(false)}
          cartItems={cartItems}
          subTotal={subTotal}
          onQtyChange={handleQtyChange}
          onRemoveItem={handleRemoveItem}
          wishlistCount={wishlistCount}
        />
      )}
    </>
  );
}
