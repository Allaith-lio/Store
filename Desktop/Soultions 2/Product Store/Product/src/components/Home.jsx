import { useEffect, useState } from "react";

const FEATURED_PRODUCTS_URL =
  "https://dummyjson.com/products?limit=4&select=id,title,price,thumbnail,category";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadFeaturedProducts = async () => {
      try {
        const response = await fetch(FEATURED_PRODUCTS_URL, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Could not load featured products (HTTP ${response.status}).`);
        }

        const data = await response.json();
        if (!Array.isArray(data.products)) {
          throw new Error("The featured products response was not in the expected format.");
        }

        setProducts(data.products);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "An unexpected error occurred.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadFeaturedProducts();
    return () => controller.abort();
  }, []);

  return (
    <div id="home" className="bg-[#080b09]">
      <section className="mx-auto max-w-[1440px] px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-12 lg:pb-24">
        <div className="mb-8 flex items-center justify-between border-b border-white/15 pb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/45 sm:text-xs">
          <span>Independent edit · Issue 01</span>
          <span>Objects for everyday life</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="relative z-10 lg:col-span-5">
            <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-green-300 sm:text-sm">
              <span className="h-px w-8 bg-green-400" />
              A store with a point of view
            </p>
            <h1 className="max-w-3xl font-serif text-[clamp(3.75rem,9vw,7.5rem)] leading-[0.88] tracking-[-0.075em] text-[#f0f1e9]">
              Keep
              <br />
              <span className="text-green-400">good</span> things
              <br />
              close.
            </h1>
            <div className="mt-8 grid gap-6 border-l border-green-400/50 pl-5 sm:mt-10 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-8">
              <p className="max-w-sm text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
                Useful objects, considered details, and small everyday upgrades.
                Find something worth bringing into your day.
              </p>
              <a
                href="#products"
                className="group inline-flex w-fit items-center gap-4 border-b border-green-400/70 pb-2 text-sm font-medium text-green-300 transition hover:border-green-300 hover:text-green-200"
              >
                Explore the collection
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <div className="absolute -right-5 -top-5 h-28 w-28 border-r border-t border-green-400/50 sm:-right-7 sm:-top-7 sm:h-40 sm:w-40" aria-hidden="true" />
            <div className="absolute -bottom-5 -left-5 h-20 w-20 border-b border-l border-white/20 sm:-bottom-7 sm:-left-7 sm:h-28 sm:w-28" aria-hidden="true" />
            <div className="relative grid min-h-[340px] grid-cols-6 grid-rows-6 gap-2 overflow-hidden bg-[#141914] p-3 sm:min-h-[500px] sm:gap-3 sm:p-5">
              <div className="absolute inset-0 opacity-30" aria-hidden="true" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
              <div className="relative col-span-4 row-span-6 flex items-center justify-center overflow-hidden bg-[#202a20]">
                {products[0] && (
                  <img
                    src={products[0].thumbnail}
                    alt={products[0].title}
                    fetchPriority="high"
                    className="h-full w-full object-contain p-5 transition duration-500 hover:scale-105 sm:p-10"
                  />
                )}
                <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.18em] text-white/45 sm:bottom-5 sm:left-5">
                  Fig. 01 — In focus
                </span>
              </div>
              <div className="relative col-span-2 row-span-3 flex items-center justify-center overflow-hidden bg-[#29352a]">
                {products[1] && (
                  <img
                    src={products[1].thumbnail}
                    alt={products[1].title}
                    className="h-full w-full object-contain p-2 sm:p-4"
                  />
                )}
                <span className="absolute bottom-2 right-2 text-[9px] text-white/50">02</span>
              </div>
              <div className="relative col-span-2 row-span-3 flex items-center justify-center overflow-hidden bg-[#d8dacd]">
                {products[2] && (
                  <img
                    src={products[2].thumbnail}
                    alt={products[2].title}
                    className="h-full w-full object-contain p-2 sm:p-4"
                  />
                )}
                <span className="absolute bottom-2 right-2 text-[9px] text-black/50">03</span>
              </div>
              <div className="absolute right-3 top-3 hidden -rotate-90 origin-top-right text-[9px] uppercase tracking-[0.24em] text-white/40 sm:block sm:right-5 sm:top-5">
                Selected objects · LIO Store
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em] text-white/40 sm:mt-4 sm:text-xs">
              <span>Product, not promises.</span>
              <span className="text-right">A closer look at everyday essentials ↗</span>
            </div>
            {loading && (
              <span className="sr-only" role="status">
                Loading product photography
              </span>
            )}
            {error && (
              <p className="mt-3 text-xs text-red-300" role="status">
                Product photography could not be loaded. {error}
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="featured-heading"
        className="border-y border-white/10 bg-[#0d110e]"
      >
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-green-300 sm:text-xs">
                Picked for the everyday
              </p>
              <h2
                id="featured-heading"
                className="mt-3 font-serif text-3xl tracking-[-0.045em] text-[#f0f1e9] sm:text-5xl"
              >
                The current edit
              </h2>
            </div>
            <a
              href="#products"
              className="border-b border-white/25 pb-1 text-xs text-white/65 transition hover:border-green-400 hover:text-green-300 sm:text-sm"
            >
              All products <span aria-hidden="true">↗</span>
            </a>
          </div>

          {loading ? (
            <div
              className="flex min-h-52 items-center justify-center gap-3 text-sm text-white/55"
              role="status"
              aria-live="polite"
            >
              <span className="size-4 animate-spin rounded-full border-2 border-green-400/20 border-t-green-400" />
              Finding a few good things...
            </div>
          ) : error ? (
            <p className="border-y border-white/10 py-8 text-center text-sm text-white/60" role="alert">
              {error}{" "}
              <a href="#products" className="text-green-300 hover:text-green-200">
                Browse the full collection
              </a>
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-5 sm:gap-y-8">
              {products.map((product, index) => (
                <a
                  key={product.id}
                  href="#products"
                  className="group border-t border-white/15 pt-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <div className={`relative flex aspect-[4/4.5] items-center justify-center overflow-hidden ${index % 2 === 0 ? "bg-[#182019]" : "bg-[#d8dacd]"}`}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                      className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105 sm:p-8"
                    />
                    <span className={`absolute left-3 top-3 text-[9px] uppercase tracking-[0.15em] ${index % 2 === 0 ? "text-white/45" : "text-black/45"}`}>
                      0{index + 1} / Selection
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 pt-3">
                    <div>
                      <h3 className="line-clamp-2 text-sm font-medium text-white/85 sm:text-base">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-[10px] capitalize text-white/40 sm:text-xs">
                        {product.category}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-green-300 sm:text-sm">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        id="about"
        aria-labelledby="about-heading"
        className="mx-auto grid max-w-[1440px] gap-6 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-[1fr_1.2fr] md:items-start lg:px-12"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-green-300 sm:text-xs">
            A note on what we do
          </p>
          <h2
            id="about-heading"
            className="mt-3 max-w-xl font-serif text-3xl leading-tight tracking-[-0.045em] text-[#f0f1e9] sm:text-5xl"
          >
            Less noise.
            <br />
            More keepers.
          </h2>
        </div>
        <p className="max-w-xl border-l border-green-400/45 pl-5 text-sm leading-7 text-white/55 sm:mt-8 sm:text-base sm:leading-8">
          We bring a considered mix of products together in one place. From
          useful daily essentials to the occasional unexpected find, LIO Store
          is about making it easier to choose well—and enjoy what you choose.
        </p>
      </section>
    </div>
  );
};

export default Home;
