import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { products } from "../../data/products";
import { useShoppingCart } from "../../context/CartContext";

// The product we want to highlight (Modern Smart Watch)
const spotlight = products.find((p) => p.id === 4);

export default function SpotlightSection() {
  const { increaseCartQuantity } = useShoppingCart();

  if (!spotlight) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
      <div className="relative grid items-center gap-8 overflow-hidden rounded-card border border-white/10 bg-linear-to-br from-[#244b7b] via-[#2b5b8f] to-[#3975a4] p-8 text-white shadow-card md:grid-cols-2 md:p-14">
        {/* Decorative circles: soft white + blue + a thin accent ring (no yellow fill, it turns muddy on navy) */}
        <span className="absolute -right-16 -top-16 size-64 rounded-full bg-white/5" />
        <span className="absolute -bottom-20 -left-16 size-64 rounded-full bg-primary/30" />
        <span className="absolute -bottom-6 -left-4 size-40 rounded-full border-2 border-accent/40" />

        <div className="relative z-10">
          <span className="inline-block rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wide text-gray-950">
            {spotlight.label}
          </span>

          <h2 className="mt-5">{spotlight.name}</h2>

          <p className="mt-4 max-w-md leading-7 text-white/80">
            {spotlight.description}
          </p>

          <div className="mt-5 flex items-center gap-4">
            <span className="font-heading text-3xl font-semibold">
              ${spotlight.price.toFixed(2)}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold">
              <Star className="size-4 fill-accent text-accent" />
              {spotlight.rating}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => increaseCartQuantity(spotlight.id)}
              className="btn rounded-full bg-accent px-6 py-3 text-gray-950 hover:brightness-110"
            >
              <ShoppingCart className="size-4" />
              Add To Cart
            </button>
            <Link
              to={`/products/${spotlight.id}`}
              className="btn rounded-full border-white/40 px-6 py-3 text-white hover:bg-white/10"
            >
              More Details
            </Link>
          </div>
        </div>

        <div className="relative z-10">
          <img
            src={spotlight.image}
            alt={spotlight.name}
            className="aspect-4/3 w-full rounded-card object-cover shadow-raised"
          />
        </div>
      </div>
    </section>
  );
}
