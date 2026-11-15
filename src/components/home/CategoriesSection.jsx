import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { products } from "../../data/products";

const categories = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Home",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Clothing",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
  },
];

export default function CategoriesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-primary-text">
          Shop by category
        </p>
        <h2 className="mt-3">Find what you need, faster</h2>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map(({ name, image }) => {
          const count = products.filter((p) => p.category === name).length;

          return (
            <Link
              key={name}
              to="/products"
              className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-card border border-line p-5 text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-raised md:h-72"
            >
              <img
                src={image}
                alt={name}
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />

              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="font-heading text-xl font-semibold">{name}</p>
                  <p className="text-sm text-white/80">{count} products</p>
                </div>
                <span className="flex size-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-md transition-colors group-hover:bg-accent group-hover:text-gray-950">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
