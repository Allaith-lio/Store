
import { useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  X,
  House,
  List,
  Heart,
  Package,
  CircleHelp,
  Headphones,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Info,
} from "lucide-react";
import Button from "../common/Button";

const defaultAvatar =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const menuLinks = [
  { to: "/", label: "Home", Icon: House },
  { to: "/products", label: "Products", Icon: List },
  { to: "/wishlist", label: "Wishlist", Icon: Heart },
  { to: "/myCart", label: "My Cart", Icon: ShoppingCart },
  { to: "/user/profile#orders", label: "My orders", Icon: Package },
];

const helpLinks = [
  { to: "/help/faq", label: "FAQ", Icon: CircleHelp },
  { to: "/help/contact", label: "Contact us", Icon: Headphones },
  { to: "/about", label: "About", Icon: Info },
];

function Drawer({ open, onClose, title, side, children }) {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep the latest callback without restarting the keyboard effect.
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const drawerId =
      side === "left" ? "mobile-navigation" : "shopping-cart-drawer";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const drawer = document.getElementById(drawerId);
      if (!drawer) return;

      const focusable = drawer.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      const elements = Array.from(focusable).filter(
        (element) => element.getClientRects().length > 0
      );

      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [open, side]);

  if (!open) return null;

  const isLeft = side === "left";
  const drawerId = isLeft
    ? "mobile-navigation"
    : "shopping-cart-drawer";

  return (
    <div className="fixed inset-0 z-50">
      <Button
        type="button"
        ariaLabel="Close panel"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/50"
      />

      <aside
        id={drawerId}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute inset-y-0 flex w-full flex-col overflow-hidden bg-surface shadow-raised ${
          isLeft ? "left-0 max-w-85" : "right-0 max-w-md"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line p-4">
          <h2 className="font-heading text-lg font-semibold text-ink">
            {title}
          </h2>

          <Button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            ariaLabel="Close panel"
            className="rounded-control p-2 text-muted transition-colors hover:bg-page hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={22} />
          </Button>
        </div>

        {children}
      </aside>
    </div>
  );
}

function IconNavLink({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-control px-3 py-3 transition-colors ${
          isActive
            ? "bg-primary/10 font-semibold text-primary"
            : "text-ink hover:bg-page"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function MobileNavigation({onClose}) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Temporary profile section */}
      <div className="border-b border-line bg-page p-4">
        <div className="mb-3 flex items-center gap-3">
          <img
            src={defaultAvatar}
            alt="Default profile"
            className="h-12 w-12 rounded-full border-2 border-primary object-cover"
          />

          <div>
            <p className="font-heading font-semibold text-ink">
              Welcome!
            </p>
            <p className="text-sm text-muted">
              Sign in to your account
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold">
          <Link
            to="/user/login"
            onClick={onClose}
            className="text-primary hover:underline"
          >
            Sign in
          </Link>

          <span className="text-muted">|</span>

          <Link
            to="/user/signUp"
            onClick={onClose}
            className="text-primary hover:underline"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Shopping navigation */}
      <nav
        aria-label="Mobile shopping navigation"
        className="flex flex-col gap-1 border-b border-line p-3"
      >
        {menuLinks.map(({ to, label, Icon }) => (
          <IconNavLink key={to} to={to} onClick={onClose}>
            <Icon size={20} className="shrink-0 text-muted" />
            <span>{label}</span>
          </IconNavLink>
        ))}
      </nav>

      {/* Help links */}
      <nav
        aria-label="Help and information"
        className="flex flex-col gap-1 border-b border-line p-3"
      >
        {helpLinks.map(({ to, label, Icon }) => (
          <IconNavLink key={to} to={to} onClick={onClose}>
            <Icon size={19} className="shrink-0 text-muted" />
            <span>{label}</span>
          </IconNavLink>
        ))}
      </nav>

      {/* Additional links */}
      <nav
        aria-label="Legal and administration"
        className="flex flex-col gap-1 p-3"
      >
        {[
          { to: "/help/terms", label: "Terms & Conditions" },
          { to: "/help/privacy", label: "Privacy policy" },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className="rounded-control px-3 py-3 text-sm text-muted transition-colors hover:bg-page hover:text-primary"
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function CartContent({
  cartItems,
  subTotal,
  onQtyChange,
  onRemoveItem,
  onClose,
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex-1 overflow-y-auto p-5">
        {cartItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <ShoppingCart
              size={48}
              strokeWidth={1.5}
              className="text-muted"
            />

            <h3 className="font-heading text-lg font-semibold text-ink">
              Your cart is empty
            </h3>

            <p className="max-w-xs text-sm text-muted">
              You haven't added any products to your cart yet.
            </p>

            <Button
              type="button"
              onClick={() => {
                onClose();
                navigate("/products");
              }}
              className="mt-2 rounded-control bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Explore products
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="flex gap-3 border-b border-line pb-5"
              >
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-card bg-page p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-semibold text-ink">
                      {item.name}
                    </h3>

                    <span className="shrink-0 font-semibold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-muted">
                    ${item.price.toFixed(2)} each
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 rounded-control border border-line px-2 py-1">
                      <Button
                        type="button"
                        disabled={item.quantity <= 1}
                        ariaLabel={`Decrease quantity of ${item.name}`}
                        onClick={() =>
                          onQtyChange(item.id, item.quantity - 1)
                        }
                        className="text-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus size={16} />
                      </Button>

                      <span className="min-w-4 text-center text-sm text-ink">
                        {item.quantity}
                      </span>

                      <Button
                        type="button"
                        ariaLabel={`Increase quantity of ${item.name}`}
                        onClick={() =>
                          onQtyChange(item.id, item.quantity + 1)
                        }
                        className="text-muted hover:text-primary"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>

                    <Button
                      type="button"
                      ariaLabel={`Remove ${item.name}`}
                      onClick={() => onRemoveItem(item.id)}
                      className="rounded-control p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Billing */}
      {cartItems.length > 0 && (
        <div className="shrink-0 border-t border-line bg-surface p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="font-semibold text-ink">Subtotal</span>

            <span className="font-heading text-xl font-semibold text-primary">
              ${subTotal.toFixed(2)}
            </span>
          </div>
          <Button 
          type={"button"} 
          onClick={() => {
              onClose();
              navigate("/user/checkout");
            }}
          className="btn btn-primary w-full">
            Checkout
          </Button>
          <Button 
          type={"button"} 
          onClick={() => {
              onClose();
              navigate("/myCart");
            }}
          className="mt-4 btn btn-outline w-full">
            View Cart
          </Button>
        </div>
      )}
    </>
  );
}

export default function HeaderDrawers({showMenu, onCloseMenu, showCart, onCloseCart, cartItems, subTotal, onQtyChange, onRemoveItem,}) {
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <>
      <Drawer
        open={showMenu}
        onClose={onCloseMenu}
        title={
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
              <span className="font-logo text-3xl leading-none logo-gradient drop-shadow-xs pt-1 px-1 inline-block">
                Omni
              </span>
              <span className="-mt-1 font-body text-[10px] font-bold tracking-widest text-muted uppercase">
                Store
              </span>
            </div>
          </Link>}
        side="left"
      >
        <MobileNavigation onClose={onCloseMenu}/>
      </Drawer>

      <Drawer
        open={showCart}
        onClose={onCloseCart}
        title={`Your Shopping Bag (${cartCount})`}
        side="right"
      >
        <CartContent
          cartItems={cartItems}
          subTotal={subTotal}
          onQtyChange={onQtyChange}
          onRemoveItem={onRemoveItem}
          onClose={onCloseCart}
        />
      </Drawer>
    </>
  );
}
