import { Link, NavLink } from "react-router-dom";
import {
  House,
  Info,
  UserRound,
  UserRoundPlus,
  Heart,
  ShoppingCart,
  List,
  Package,
  CircleHelp,
  Headphones,
  Moon,
  Sun,
} from "lucide-react";
import Button from "./Button";
import { useTheme } from "../../context/ThemeContext";

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// Desktop navigation links
const desktopLinks = [
  { to: "/", label: "Home"},
  { to: "/products", label: "Shop"},
  { to: "/aboutUs", label: "About Us"},
  { to: "/messageUs", label: "Contact Us"},
];

// Mobile shopping links
const menuLinks = [
  { to: "/", label: "Home", Icon: House },
  { to: "/products", label: "Products", Icon: List },
  { to: "/wishlist", label: "Wishlist", Icon: Heart, badge: "wishlist" },
  { to: "/myCart", label: "My Cart", Icon: ShoppingCart },
  { to: "/user/profile#orders", label: "My orders", Icon: Package },
];

// Mobile help links
const helpLinks = [
  { to: "/help/faq", label: "FAQ", Icon: CircleHelp },
  { to: "/help/contact", label: "Contact us", Icon: Headphones },
  { to: "/aboutUS", label: "About", Icon: Info },
];

// Mobile legal links
const legalLinks = [
  { to: "/help/terms", label: "Terms & Conditions" },
  { to: "/help/privacy", label: "Privacy policy" },
];
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

const NavbarLinks = ({variant, isLoggedIn = false, wishlistCount = 0, cartCount = 0,  onOpenCart, onClose, userAvatar}) => {
  const {isDarkMode, toggleTheme} = useTheme()
  // Desktop navigation
  if (variant === "desktop") {
    return (
      <div className="flex w-full items-center justify-between">
        <nav
        aria-label="Main navigation"
        className="mx-auto flex shrink-0 items-center gap-1 xl:gap-3">
          {desktopLinks.map(({ to, label }) => (
          <NavLink key={label} to={to} className="icon-link">
            <span className="text-sm">{label}</span>
          </NavLink>
          ))}
        </nav>
        <nav aria-label="User actions" className="flex shrink-0 items-center gap-1 xl:gap-3">

        <Button 
          type="button"
          className="icon-link relative"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}>
          {isDarkMode ? (
            <Sun size={22} className="text-amber-400" />
          ) : (
            <Moon size={22} />
          )}
        </Button>
        <NavLink to="/wishlist" className="icon-link relative">
          <Heart size={21} />

          {wishlistCount > 0 && (
            <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
              {wishlistCount}
            </span>
          )}
        </NavLink>

        <Button
          type="button"
          className="icon-link relative"
          ariaLabel={`Open cart, ${cartCount} items`}
          onClick={onOpenCart}
        >
          <ShoppingCart size={22} />

          {cartCount > 0 && (
            <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
              {cartCount}
            </span>
          )}
        </Button>
        <NavLink
          to={isLoggedIn ? "/user/profile" : "/login"}
          className="icon-link"
        >
          {isLoggedIn ? (
            <UserRound size={22} />
          ) : (
            <UserRoundPlus size={22} />
          )}
        </NavLink>
        </nav>
      </div>
    );
  }

  // Mobile navigation
  if (variant === "mobile") {
    return (
      <div className="flex-1 overflow-y-auto">

        {/* Profile section */}
        <div className="border-b border-line bg-page p-4">
          <div className="mb-3 flex items-center gap-3">
            <img
              src={isLoggedIn && userAvatar ? userAvatar : defaultAvatar}
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
              to="/login"
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
          {menuLinks.map(({ to, label, Icon, badge }) => (
            <IconNavLink
              key={to}
              to={to}
              onClick={onClose}
            >
              <Icon size={20} className="shrink-0 text-muted" />
              <span>{label}</span>

              {badge === "wishlist" && wishlistCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
                  {wishlistCount}
                </span>
              )}
            </IconNavLink>
          ))}
        </nav>

        {/* Help links */}
        <nav
          aria-label="Help and information"
          className="flex flex-col gap-1 border-b border-line p-3"
        >
          {helpLinks.map(({ to, label, Icon }) => (
            <IconNavLink
              key={to}
              to={to}
              onClick={onClose}
            >
              <Icon size={19} className="shrink-0 text-muted" />
              <span>{label}</span>
            </IconNavLink>
          ))}
        </nav>

        {/* Legal links */}
        <nav
          aria-label="Legal and administration"
          className="flex flex-col gap-1 p-3"
        >
          {legalLinks.map(({ to, label }) => (
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

  return null;
};

export default NavbarLinks