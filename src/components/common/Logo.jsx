import { Link } from "react-router-dom";
import { Store } from "lucide-react";

export const Logo = ({ variant = "default", showIconOnMobile = false }) => {
  const isLight = variant === "light";

  return (
    <Link
      to="/"
      aria-label="Go to homepage"
      className={`group relative z-10 inline-flex items-center gap-2.5 py-2 transition-transform duration-300 hover:scale-[1.02] ${
        isLight ? "text-white no-underline focus-visible:outline-2 focus-visible:outline-white" : ""
      }`}
    >
      <div
        className={`
          size-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300
          ${showIconOnMobile ? "flex" : "hidden lg:flex"}
          ${
            isLight
              ? "border border-white/20 bg-white/10 text-white shadow-inner shadow-white/10"
              : "bg-primary/10 text-primary-text shadow-xs group-hover:bg-primary group-hover:text-white"
          }
        `}
      >
        <Store className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
      </div>

      <div className="flex flex-col">
        <span
          className={`font-logo inline-block px-1 pt-1 text-3xl font-bold leading-none drop-shadow-xs ${
            isLight ? "text-white" : "logo-gradient"
          }`}
        >
          Omni
        </span>
        <span
          className={`-mt-1 text-[10px] font-bold uppercase tracking-widest ${
            isLight ? "text-white/80" : "text-muted"
          }`}
        >
          Store
        </span>
      </div>
    </Link>
  );
};