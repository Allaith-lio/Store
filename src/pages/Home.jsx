import Banner from "../components/common/Banner"
import CategoriesSection from "../components/layout/CategoriesSection"
import FeaturedProducts from "../components/layout/FeaturedProducts"
import SpotlightSection from "../components/layout/SpotlightSection"
import StoreHeroDemo from "../components/layout/StoreHeroDemo"

export const Home = () => {
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
    </>
  )
}
