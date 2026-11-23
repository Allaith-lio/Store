
import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest, getAccessToken } from "../services/dashboardService";

const WishlistContext = createContext({});

const WishlistProvider = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistError, setWishlistError] = useState("");

  const refreshWishlist = async () => {
    if (!getAccessToken()) {
      setWishlistIds([]);
      setWishlistError("");
      return;
    }
    const products = await apiRequest("/users/me/wishlist");
    setWishlistIds(products.map((product) => String(product._id || product.id)));
    setWishlistError("");
  };

  useEffect(() => {
    const loadWishlist = () => {
      Promise.resolve().then(refreshWishlist).catch((error) => {
        setWishlistError(error instanceof Error ? error.message : "Unable to load wishlist.");
      });
    };
    Promise.resolve().then(loadWishlist);
    window.addEventListener("authchange", loadWishlist);
    return () => window.removeEventListener("authchange", loadWishlist);
  }, []);

  // Check if product is in wishlist
  const isInWishlist = (id) => wishlistIds.includes(String(id));

  const toggleWishlist = async (id) => {
    if (!getAccessToken()) throw new Error("Please sign in before using your wishlist.");
    setWishlistError("");
    const productId = String(id);
    const currentIds = isInWishlist(productId);
    const products = currentIds
      ? await apiRequest(`/users/me/wishlist/items/${productId}`, { method: "DELETE" })
      : await apiRequest("/users/me/wishlist/items", {
          method: "POST",
          body: { productId },
        });
    setWishlistIds(products.map((product) => String(product._id || product.id)));
  };

  const removeFromWishlist = async (id) => {
    if (!getAccessToken()) throw new Error("Please sign in before using your wishlist.");
    const products = await apiRequest(`/users/me/wishlist/items/${id}`, {
      method: "DELETE",
    });
    setWishlistIds(products.map((product) => String(product._id || product.id)));
  };

  const clearWishlist = async () => {
    if (!getAccessToken()) throw new Error("Please sign in before using your wishlist.");
    await Promise.all(
      wishlistIds.map((id) =>
        apiRequest(`/users/me/wishlist/items/${id}`, { method: "DELETE" }),
      ),
    );
    setWishlistIds([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        wishlistError,
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
