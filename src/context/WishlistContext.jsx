
import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext({});

const WishlistProvider = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync wishlist with localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Check if product is in wishlist
  const isInWishlist = (id) => wishlistIds.includes(id);

  // Add or remove product
  const toggleWishlist = (id) => {
    console.log("Toggling wishlist:", id);
    setWishlistIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((itemId) => itemId !== id)
        : [...currentIds, id]
    );
  };

  // Remove a specific product
  const removeFromWishlist = (id) => {
    setWishlistIds((currentIds) =>
      currentIds.filter((itemId) => itemId !== id)
    );
  };

  // Clear all wishlist items
  const clearWishlist = () => {
    setWishlistIds([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;

export const useWishlist = () => {
  return useContext(WishlistContext);
};
