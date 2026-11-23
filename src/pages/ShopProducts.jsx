import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  SparklesIcon,
} from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import { getProductStock } from "../services/branchService";
import { useBranch } from "../context/useBranch";
import { useShoppingCart } from "../context/useShoppingCart";

const categories = ["All", "Electronics", "Accessories", "Home", "Clothing"];

const ShopProducts = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedBranch } = useBranch();
  const { products, productsLoading, productsError } = useShoppingCart();
  const [inStockOnly, setInStockOnly] = useState(false);
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
      const matchesInStock = !inStockOnly || getProductStock(product, selectedBranch.id) > 0;
      return matchesSearch && matchesCategory && matchesInStock;
    });

    return [...results].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [products, search, category, sort, inStockOnly, selectedBranch.id]);

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
    setInStockOnly(false);
    
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

      <div className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
  <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center">
    

    <div className="relative flex-1">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors"
        size={18}
      />
      <input
        type="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Search products..."
        className="h-12 w-full rounded-control border border-line bg-page pl-11 pr-4 text-sm text-ink placeholder:text-muted/70 transition-all focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>


    <div className="relative lg:w-56">
      <SlidersHorizontal
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        size={17}
      />
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setCurrentPage(1);
        }}
        className="h-12 w-full cursor-pointer appearance-none rounded-control border border-line bg-page pl-11 pr-10 text-sm text-ink transition-all focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {categories.map((item) => (
          <option key={item} value={item} className="bg-surface text-ink">
            {item === "All" ? "All categories" : item}
          </option>
        ))}
      </select>
  
      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <div className="relative lg:w-48">
      <select
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          setCurrentPage(1);
        }}
        className="h-12 w-full cursor-pointer appearance-none rounded-control border border-line bg-page pl-4 pr-10 text-sm text-ink transition-all focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="default" className="bg-surface text-ink">Sort by default</option>
        <option value="price-low" className="bg-surface text-ink">Price: Low to high</option>
        <option value="price-high" className="bg-surface text-ink">Price: High to low</option>
        <option value="rating" className="bg-surface text-ink">Highest rated</option>
      </select>

      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    <label className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-control border border-line bg-page px-4 text-sm text-ink">
  <input
    type="checkbox"
    checked={inStockOnly}
    onChange={(e) => {
      setInStockOnly(e.target.checked);
      setCurrentPage(1);
    }}
    className="size-4 accent-primary"
  />
  In stock here
</label>
  </div>
</div>
<div className="mt-5 flex items-center justify-between px-1">
  <p className="text-sm text-muted">
    Showing{" "}
    <span className="font-semibold text-ink">{filteredProducts.length}</span>{" "}
   {filteredProducts.length === 1 ? "product" : "products"} · {selectedBranch.name}
  </p>
  
 {(search || category !== "All" || sort !== "default" || inStockOnly) && (
    <button
      type="button"
      onClick={clearFilters}
      className="group inline-flex items-center gap-1.5 cursor-pointer text-sm font-medium text-primary hover:text-primary-hover transition-colors"
    >
      <span>Clear filters</span>
    </button>
  )}
</div>

      {productsError ? (
        <p role="alert" className="mt-8 text-center text-red-500">
          {productsError}
        </p>
      ) : productsLoading ? (
        <p className="mt-8 text-center text-muted">Loading products...</p>
      ) : filteredProducts.length > 0 ? (
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
