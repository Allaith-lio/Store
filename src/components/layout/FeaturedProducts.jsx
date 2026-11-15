import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { products } from "../../data/products";

// The 4 highest rated products
const topProducts = [...products]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 4);

export default function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-primary-text">
            Top rated
          </p>
          <h2 className="mt-3">Loved by our customers</h2>
        </div>

        <Link to="/products" className="btn btn-outline rounded-full px-5 py-2.5">
          View all products
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {topProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
