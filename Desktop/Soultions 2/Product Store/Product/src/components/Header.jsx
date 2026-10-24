const Header = () => {
  return (
    <header className="border-b border-white/10 bg-[#080b09]">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12"
      >
        <a
          href="#home"
          className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/45 sm:text-xs"
        >
          LIO STORE
        </a>

        <div className="flex items-center gap-1 sm:gap-3">
          <a
            href="#home"
            className="px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:text-green-300 sm:px-4 sm:text-sm"
          >
            Home
          </a>
          <a
            href="#products"
            className="px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:text-green-300 sm:px-4 sm:text-sm"
          >
            Products
          </a>
          <a
            href="#about"
            className="px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:text-green-300 sm:px-4 sm:text-sm"
          >
            About
          </a>
          <a
            href="#products"
            className="ml-2 hidden border border-green-400/50 px-4 py-2 text-xs font-medium text-green-300 transition hover:bg-green-400 hover:text-black sm:inline-flex sm:text-sm"
          >
            Shop the edit{" "}
            <span aria-hidden="true" className="ml-3">
              ↗
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
