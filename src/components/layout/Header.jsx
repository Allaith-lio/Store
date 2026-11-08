import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { Logo } from "../common/Logo";

export default function Header({ showLinks = true }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 991px)").matches,
  );

  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 59.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    },
    {
      id: 2,
      name: "Minimalist Leather Watch",
      price: 129.5,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    },
    {
      id: 3,
      name: "Ergonomic Coffee Mug",
      price: 24.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80",
    },
  ]);
  const isLoggedIn = true;
  // const wishlistCount = 0;
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const handleQtyChange = (id, quantity) => {
    if (quantity < 1) return;

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  };
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
      {/* Main navigation */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface shadow-card">
        <div className="mx-auto flex justify-between min-h-18 max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
          {/* Mobile menu toggle */}
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

          {/* Logo */}
          <Logo/>
          {!showLinks && (
            <Link 
              to="/myCart" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition-colors hover:text-primary-text"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Back to Cart
            </Link>
          )}
          {/* Desktop navigation */}
          {showLinks && !isMobile && (
            <>
              <NavbarLinks
                variant="desktop"
                isLoggedIn={isLoggedIn}
                cartCount={cartCount}
                onOpenCart={() => setShowCart(true)}
                onOpenProfile={() => setShowProfile(true)}
              />
            </>
          )}

          {/* Mobile profile and cart */}
          {showLinks && isMobile && (
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <Button
                type="button"
                className="icon-link relative"
                aria-label={
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
                    onClick={() => setShowProfile(true)}
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
                  type={"button"}
                  className={`relative rounded-control p-2 text-primary-text hover:bg-page`}
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
          showProfile={showProfile}
          onCloseProfile={() => setShowProfile(false)}
          cartItems={cartItems}
          subTotal={subTotal}
          onQtyChange={handleQtyChange}
          onRemoveItem={handleRemoveItem}
        />
      )}
    </>
  );
}
