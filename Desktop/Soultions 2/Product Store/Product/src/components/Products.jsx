import { useCallback, useEffect, useMemo, useState } from "react";
import ProductDetails from "./ProductDetails.jsx";
import Searching from "./Searching.jsx";

const API_URL = "https://dummyjson.com/products?limit=100";
const PRODUCTS_PER_PAGE = 8;

const LoadingSpinner = () => (
  <div
    className="flex min-h-72 flex-col items-center justify-center gap-4 text-white/60"
    role="status"
    aria-live="polite"
  >
    <span className="size-10 animate-spin rounded-full border-4 border-green-400/20 border-t-green-400" />
    <span className="text-sm">Loading products...</span>
  </div>
);

const ProductCard = ({ product, onShowDetails }) => (
  <article className="group flex h-full flex-col border-t border-white/15 transition-colors hover:border-green-400/60">
    <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#151b15] p-5">
      <img
        src={product.thumbnail}
        alt={product.title}
        loading="lazy"
        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
      />
      <span className="absolute left-4 top-4 max-w-[75%] truncate bg-black/65 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-green-300 backdrop-blur">
        {product.category}
      </span>
    </div>

    <div className="flex flex-1 flex-col pt-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 min-h-12 text-base font-medium leading-6 text-[whitesmoke]">
          {product.title}
        </h3>
        <span className="shrink-0 text-sm font-semibold text-green-300">
          ${product.price.toFixed(2)}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-white/45">
        {product.description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 py-3 text-xs">
        <span className="truncate text-white/40">
          Brand:{" "}
          <span className="capitalize text-white/65">
            {product.brand || "Unbranded"}
          </span>
        </span>
        <span className="shrink-0 text-amber-300">
          ★ <span className="text-[whitesmoke]">{product.rating.toFixed(1)}</span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => onShowDetails(product)}
        className="mt-2 w-full border border-white/20 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-green-400 hover:bg-green-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        View details <span aria-hidden="true">↗</span>
      </button>
    </div>
  </article>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setFetchError("");

      try {
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Could not load products (HTTP ${response.status}).`);
        }

        const data = await response.json();
        if (!Array.isArray(data.products)) {
          throw new Error("The product response was not in the expected format.");
        }

        setProducts(data.products);
      } catch (error) {
        if (!controller.signal.aborted) {
          setFetchError(
            error instanceof Error ? error.message : "An unexpected error occurred.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [retryCount]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;
      const searchableText = [
        product.title,
        product.brand,
        product.category,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [category, products, searchTerm]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const closeDetails = useCallback(() => setSelectedProduct(null), []);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

  return (
    <main id="products" className="min-h-screen bg-[#080b09]">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mb-9 flex flex-col gap-5 border-b border-white/15 pb-7 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-green-300 sm:text-xs">
            LIO Store · The catalog
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-[-0.045em] text-[#f0f1e9] sm:text-5xl">
            Find your next favorite.
          </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/45 sm:text-right">
          Thoughtful picks for everyday life. Search by name or category to
          find your own good thing.
          </p>
        </div>

        <Searching
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />

        {loading ? (
          <LoadingSpinner />
        ) : fetchError ? (
          <div
            className="rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-10 text-center"
            role="alert"
          >
            <p className="text-[whitesmoke]">{fetchError}</p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-4 rounded-xl bg-green-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-green-300"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <p className="text-sm text-white/50" aria-live="polite">
                {filteredProducts.length === 0
                  ? "No products found"
                  : `Showing ${(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–${Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of ${filteredProducts.length} products`}
              </p>
              <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                {PRODUCTS_PER_PAGE} products per page
              </span>
            </div>

            {visibleProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onShowDetails={setSelectedProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-14 text-center">
                <p className="text-lg font-semibold text-[whitesmoke]">
                  No matching products
                </p>
                <p className="mt-2 text-sm text-white/50">
                  Try another search or choose a different category.
                </p>
              </div>
            )}

            {filteredProducts.length > 0 && (
              <nav
                aria-label="Product pages"
                className="mt-8 flex items-center justify-center gap-4"
              >
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => page - 1)}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-[whitesmoke] transition hover:border-green-400/40 hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Previous
                </button>
                <span className="min-w-20 text-center text-sm text-white/55">
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => page + 1)}
                  disabled={currentPage === pageCount}
                  className="rounded-xl bg-green-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={closeDetails} />
      )}
    </main>
  );
};

export default Products;
