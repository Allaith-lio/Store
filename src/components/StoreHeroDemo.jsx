

export default function StoreHeroDemo() {


return (
    <section className="section max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Text & Actions */}
        <div className="space-y-6">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase">
            New Arrival • 2026 Collection
          </span>
          
          <h1 className="font-heading font-bold text-ink leading-tight">
            Discover Quality Essentials for Modern Living
          </h1>
          
          <p className="text-muted text-base md:text-lg font-body max-w-lg">
            Explore our curated multi-category marketplace featuring premium beauty items, elegant home furniture, and fresh daily selections.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button type="button" className="btn btn-primary">
              Shop Collection
            </button>
            <button type="button" className="btn btn-outline">
              Browse Categories
            </button>
          </div>
        </div>

        {/* Right Side: Featured Product Card Preview */}
        <div className="bg-surface p-6 md:p-8 rounded-card shadow-card border border-line">
          <div className="w-full h-64 bg-page rounded-control flex items-center justify-center mb-6 text-muted text-sm font-medium border border-dashed border-line">
            <img src="../../public/favicon.svg" alt="" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Best Seller</span>
              <span className="text-xs text-muted">In Stock</span>
            </div>
            
            <h3 className="text-lg font-semibold text-ink">Ergonomic Wooden Accent Chair</h3>
            
            <p className="text-muted text-sm line-clamp-2">
              Designed for optimal home comfort with sustainable materials and sleek contemporary lines.
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-line/60">
              <span className="text-xl font-bold text-primary">$189.00</span>
              <button type="button" className="btn btn-primary text-xs px-4 py-2">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}