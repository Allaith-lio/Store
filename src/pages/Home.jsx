import { ArrowUp } from "lucide-react"
import Banner from "../components/common/Banner"
import CategoriesSection from "../components/home/CategoriesSection"
import FeaturedProducts from "../components/home/FeaturedProducts"
import SpotlightSection from "../components/home/SpotlightSection"
import StoreHeroDemo from "../components/home/StoreHeroDemo"
import { useEffect, useState } from "react"

export const Home = () => {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
      const handleScroll = () => setShowTop(window.scrollY > 400);
  
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  return (
    <>
      <StoreHeroDemo />
      <CategoriesSection />
      <FeaturedProducts />
      <SpotlightSection />

      <div className="mx-auto max-w-7xl px-6">
        <Banner
          title="Ready to find your next favorite?"
          description="Explore the whole collection, save what you love, and check out in a few simple steps."
          to="/products"
          linkText="Browse Products"
        />
      </div>
      {showTop && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
            document.body.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-6 right-6 z-50 grid size-12 cursor-pointer place-items-center rounded-full bg-primary text-white shadow-raised outline-none transition-transform duration-200 hover:scale-110 hover:bg-primary-hover focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  )
}
