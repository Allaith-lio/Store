const ProductCard = ({ product }) => {
  return (
    <div className="group relative flex h-[420px] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-line shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-raised">

      {/* Product Image */}
      <img
        src={product.thumbnail}
        alt={product.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-black/20"></div>

      {/* Top Information */}
      <div className="relative z-10 flex items-start justify-between p-4">

        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-md">
            {product.category}
          </span>

          <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-md">
            ⭐ {product.rating} Rating
          </span>
        </div>

        <span className="text-xl font-bold text-white">
          ${product.price}
        </span>
      </div>

      {/* Bottom Information */}
      <div className="relative z-10 mt-auto flex flex-col gap-3 p-5 text-white">

        <h3 className="text-xl font-bold">
          {product.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-6 text-white/80">
          {product.description}
        </p>

        <button className="btn btn-primary w-full">
          Buy Now
          <span>→</span>
        </button>
          <button className="btn btn-outline w-full">
    More Details
  </button>

      </div>
    </div>
  );
};

export default ProductCard;