const Searching = ({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
}) => {
  return (
    <section
      aria-label="Find products"
      className="mb-8 grid gap-3 border-b border-white/10 pb-5 sm:grid-cols-[minmax(0,1fr)_15rem] sm:gap-4"
    >
      <label className="relative block">
        <span className="sr-only">Search products</span>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m16 16 4 4" />
        </svg>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, brand, or category..."
          className="w-full border border-white/15 bg-[#0d110e] py-3 pl-12 pr-4 text-sm text-[whitesmoke] outline-none transition placeholder:text-white/35 focus:border-green-400/60 focus:ring-1 focus:ring-green-400/30"
        />
      </label>

      <label className="block">
        <span className="sr-only">Filter by category</span>
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="w-full border border-white/15 bg-[#0d110e] px-4 py-3 text-sm text-[whitesmoke] outline-none transition focus:border-green-400/60 focus:ring-1 focus:ring-green-400/30"
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
};

export default Searching;
