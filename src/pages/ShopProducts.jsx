import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  SparklesIcon,
} from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";

const categories = ["All", "Electronics", "Accessories", "Home", "Clothing"];

const ShopProducts = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const productsInPage = 8;

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const results = products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      const matchesCategory =
        category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
    });

    return [...results].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return a.id - b.id;
    });
  }, [search, category, sort]);

  const indexOfLastItem = currentPage * productsInPage;
  const indexOfFirstItem = indexOfLastItem - productsInPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsInPage);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-2xl py-8 text-center md:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-primary-text shadow-card">
          <SparklesIcon className="size-4 text-accent" />
          Our collection
        </span>

        <h1 className="mt-6">
          Explore Our{" "}
          <span className="font-logo logo-gradient text-[1.3em]">
            Products{" "}
          </span>{" "}
          here
        </h1>

        <p className="mt-5 leading-8 text-muted">
          Discover our current collection and find everything you're looking for
          in one place.
        </p>
      </section>

      <div className=" rounded-card border border-line bg-surface p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[grey]"
              size={19}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products..."
              className="h-12 w-full rounded-control border border-line bg-page pl-11 pr-4 text-sm text-ink placeholder:text-[grey] focus:border-primary focus:outline-none"
            />
          </div>

          <div className="relative lg:w-56">
            <SlidersHorizontal
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[grey]"
              size={18}
            />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="h-12 w-full cursor-pointer appearance-none rounded-control border border-line bg-page pl-11 pr-9 text-sm text-ink focus:border-primary focus:outline-none"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All categories" : item}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:w-48">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              className="h-12 w-full cursor-pointer rounded-control appearance-none border border-line bg-page px-3 text-sm text-ink focus:border-primary focus:outline-none"
            >
              <option value="default">Sort by default</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-[grey]">
          Showing{" "}
          <span className="font-bold text-ink">{filteredProducts.length}</span>{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </p>
        {(search || category !== "All" || sort !== "default") && (
          <button
            type="button"
            onClick={clearFilters}
            className="cursor-pointer text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <>
          <div className="mt-5 grid grid-cols-1 gap-5 min-[451px]:grid-cols-2 min-[791px]:grid-cols-3 min-[1024px]:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-primary h-11 gap-2 px-3 sm:px-4 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-11 min-w-11 cursor-pointer rounded-control px-3 text-sm font-semibold transition ${
                    currentPage === page
                      ? "bg-primary text-white shadow-md"
                      : "border border-line bg-surface text-ink hover:border-primary hover:text-primary"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(page + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="btn btn-primary h-11 gap-2 px-3 sm:px-4 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-5 px-4 py-16 text-center">
          <Search className="mx-auto text-[grey]" size={32} />
          <h2 className="mt-4 text-xl text-ink">No products found</h2>
          <p className="mt-2 text-sm text-[grey]">
            Try a different search or clear your filters.
          </p>
          <button
            onClick={clearFilters}
            className="cursor-pointer mt-5 rounded-control bg-primary px-5 py-2.5 text-sm text-white hover:bg-primary-hover"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopProducts;
