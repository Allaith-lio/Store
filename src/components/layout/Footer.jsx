
import { Link } from "react-router-dom";
import { Search, Star, PackageCheck} from "lucide-react";
import { Logo } from "../common/Logo";

const shopLinks = [
  { label: "Home", to: "/" },
  { label: "All Products", to: "/products" },
  { label: "My Cart", to: "/myCart"},
  { label: "My Wishlist", to: "/wishlist" },
];

const supportLinks = [
  { label: "About Us", to: "/aboutUs" },
  { label: "FAQs", to: "/help/faq" },
  { label: "Contact Us", to: "/contactUs" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];

const benefits = [
  {
    icon: Search,
    title: "Easy Browsing",
    description: "Find products with ease",
  },
  {
    icon: Star,
    title: "Your Favorites",
    description: "Keep track of products you love",
  },
  {
    icon: PackageCheck,
    title: "Simple Shopping",
    description: "A clear and convenient shopping experience",
  },
];

function FooterLinks({ title, links }) {
  return (
    <div>
      <h3 className="mb-5 font-heading text-sm font-bold tracking-wide text-ink">
        {title}
      </h3>

      <ul className="space-y-3">
        {links.map(({ label, to}) => (
          <li key={to}>
            <Link
              to={to}
              className="inline-flex items-center gap-2 text-sm text-muted no-underline transition-colors hover:text-primary-text"
            >
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      {/* Benefits */}
      <div className="border-b border-line">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-card bg-primary/10 text-primary-text">
                <Icon size={23} strokeWidth={1.8} aria-hidden="true" />
              </div>

              <div>
                <h4 className="font-heading text-sm font-bold text-ink">
                  {title}
                </h4>
                <p className="mt-1 text-xs leading-5 text-muted">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo/>

            <p className="max-w-sm text-sm leading-7 text-muted">
              Discover products you’ll love. Explore the collection, save your
              favorites, and enjoy a simpler online shopping experience.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-5">
            <FooterLinks title="Explore" links={shopLinks} />
            <FooterLinks title="Customer Care" links={supportLinks} />
          </div>

          {/* Account */}
          <div className="lg:col-span-3">
            <h3 className="mb-5 font-heading text-sm font-bold tracking-wide text-ink">
              Your Account
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/user/login"
                  className="text-sm text-muted no-underline transition-colors hover:text-primary-text"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/user/signUp"
                  className="text-sm text-muted no-underline transition-colors hover:text-primary-text"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  to="/user/profile"
                  className="text-sm text-muted no-underline transition-colors hover:text-primary-text"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex lg:flex-row flex-col justify-between  mt-12 border-t border-line pt-6 sm:mt-16">
          <p className="text-xs leading-5 text-muted">
            © {new Date().getFullYear()} Omni Store. All rights reserved.
          </p>
          <div className="flex flex-wrap lg:flex-row flex-col justify-between mt-2 gap-x-5 gap-y-3">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-muted no-underline transition-colors hover:text-primary-text"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
