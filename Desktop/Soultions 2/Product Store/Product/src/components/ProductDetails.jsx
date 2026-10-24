import { useEffect, useState } from "react";

const ProductDetails = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0] ?? product.thumbnail,
  );
  const images = product.images?.length ? product.images : [product.thumbnail];
  const reviews = product.reviews ?? [];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="product-details-title"
        aria-modal="true"
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto border border-white/15 bg-[#0d110e] shadow-2xl shadow-black/60"
        role="dialog"
      >
        <button
          type="button"
          aria-label="Close product details"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center border border-white/20 bg-black/70 text-xl text-white/80 transition hover:border-green-400/50 hover:text-green-300"
        >
          &times;
        </button>

        <div className="grid md:grid-cols-2">
          <div className="bg-[#151b15] p-5 sm:p-8">
            <div className="flex h-72 items-center justify-center bg-[#202a20] p-5 sm:h-96">
              <img
                src={selectedImage}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    aria-label={`Show product image ${index + 1}`}
                    aria-pressed={selectedImage === image}
                    onClick={() => setSelectedImage(image)}
                    className={`flex size-16 shrink-0 items-center justify-center border bg-black/30 p-2 transition ${
                      selectedImage === image
                        ? "border-green-400"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <span className="inline-flex bg-green-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-green-300">
              {product.category}
            </span>
            <h2
              id="product-details-title"
              className="mt-4 pr-10 font-serif text-3xl tracking-[-0.045em] text-[whitesmoke] sm:text-4xl"
            >
              {product.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-white/10 py-4">
              <span className="text-2xl font-bold text-green-300">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-white/65">
                Brand:{" "}
                <span className="font-medium capitalize text-[whitesmoke]">
                  {product.brand || "Unbranded"}
                </span>
              </span>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[whitesmoke]">
                Customer reviews
              </h3>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-amber-300" aria-label="Rating">
                  ★
                </span>
                <span className="font-semibold text-[whitesmoke]">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-sm text-white/45">
                  ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>

              {reviews.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {reviews.map((review, index) => (
                    <li
                      key={`${review.reviewerName}-${index}`}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-medium text-[whitesmoke]">
                          {review.reviewerName}
                        </span>
                        <span className="text-sm text-amber-300">
                          {"★".repeat(Math.round(review.rating))}
                          <span className="ml-1 text-white/45">
                            {review.rating}/5
                          </span>
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {review.comment}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/50">
                  No customer comments are available for this product yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
