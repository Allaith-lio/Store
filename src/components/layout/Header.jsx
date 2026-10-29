
import { useEffect, useState } from "react";
import { Link, NavLink} from "react-router-dom";
import { Menu, House, Heart, UserRound, UserRoundPlus, MessageSquareText, ShoppingCart, Info} from "lucide-react";
import HeaderDrawers from "./HeaderDrawers";
import Button from "../common/Button";

export default function Header() {

  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 991px)").matches
  );

  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 59.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80"
  },
  {
    id: 2,
    name: "Minimalist Leather Watch",
    price: 129.50,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80"
  },
  {
    id: 3,
    name: "Ergonomic Coffee Mug",
    price: 24.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80"
  }
  ]);
  const isLoggedIn = false;
  const wishlistCount = 0;

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

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleQtyChange = (id, quantity) => {
    if (quantity < 1) return;

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  return (
    <>
      {/* Main navigation */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface shadow-card">
        <div className="mx-auto flex min-h-18 max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
          {/* Mobile menu toggle */}
          {isMobile && (
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
          <Link
            to="/"
            aria-label="Go to homepage"
            className="group flex items-center gap-2.5 py-2 transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="hidden lg:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs transition-colors group-hover:bg-primary group-hover:text-white">
              <svg 
                className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-logo text-3xl leading-none logo-gradient font-bold drop-shadow-xs pt-1 px-1 inline-block">
                Omni
              </span>
              <span className="-mt-1 font-body text-[10px] font-bold tracking-widest text-muted uppercase">
                Store
              </span>
            </div>
          </Link>
          {/* Desktop navigation */}
          {!isMobile && (
            <>
            <div className="hidden lg:flex flex-1 items-center px-6">
              <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                Everything you need, all in one place.
              </p>
            </div>
              <nav
                aria-label="Main navigation"
                className="ml-auto flex shrink-0 items-center gap-1 xl:gap-3"
              >
                <NavLink to="/" className={"icon-link"}>
                  <House size={21} />
                  <span className="text-xs">Home</span>
                </NavLink>

                <NavLink
                  to={isLoggedIn ? "/user/profile" : "/user/signUp"}
                  className={"icon-link"}
                >
                  {isLoggedIn ? (
                    <UserRound size={22} />
                  ) : (
                    <UserRoundPlus size={22} />
                  )}

                  <span className="text-xs">
                    {isLoggedIn ? "Profile" : "Register"}
                  </span>
                </NavLink>

                <NavLink to="/messageUs" className={"icon-link"}>
                  <MessageSquareText size={21} />
                  <span className="text-xs">Contact Us</span>
                </NavLink>
                <NavLink to="/messageUs" className={"icon-link"}>
                  <Info size={21} />
                  <span className="text-xs">About Us</span>
                </NavLink>

                <NavLink
                  to="/wishlist"
                  className={`${"icon-link"} relative`}
                >
                  <Heart size={21} />
                  <span className="text-xs">Wishlist</span>

                  {wishlistCount > 0 && (
                    <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
                      {wishlistCount}
                    </span>
                  )}
                </NavLink>
                <Button
                type={"button"}
                className={`${"icon-link"} relative`}
                ariaLabel={`Open cart, ${cartCount} items`}
                onClick={() => setShowCart(true)}>
                  <ShoppingCart size={22} />
                  <span className="text-xs">My Cart</span>

                  {cartCount > 0 && (
                    <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </nav>
            </>
            
          )}

          {/* Mobile profile and cart */}
          {isMobile && (
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <Link
                to={isLoggedIn ? "/user/profile" : "/user/signUp"}
                aria-label={isLoggedIn ? "Profile" : "Register"}
                className="rounded-control p-2 text-ink hover:bg-page"
              >
                {isLoggedIn ? (
                  <UserRound size={22} />
                ) : (
                  <UserRoundPlus size={22} />
                )}
              </Link>
              <Button
              type={"button"}
              className={`relative rounded-control p-2 text-primary hover:bg-page`}
              ariaLabel={`Open cart, ${cartCount} items`}
              onClick={() => setShowCart(true)}>
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

      <HeaderDrawers 
        showMenu={showMenu}
        onCloseMenu={() => setShowMenu(false)}
        showCart={showCart}
        onCloseCart={() => setShowCart(false)}
        cartItems={cartItems}
        subTotal={subTotal}
        onQtyChange={handleQtyChange}
        onRemoveItem={handleRemoveItem}
      />
    </>
  );
}
