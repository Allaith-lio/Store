
import { useCallback, useEffect, useState } from "react";
import { CartContext } from "./CartContextValue";
import { useBranch } from "./useBranch";
import { apiRequest, getAccessToken } from "../services/dashboardService";
import {
  fetchCatalogProducts,
  getProductStock,
} from "../services/branchService";

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const { selectedBranch } = useBranch();

  const refreshProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError("");
    try {
      const items = await fetchCatalogProducts();
      setProducts(items);
      return items;
    } catch (error) {
      setProductsError(error instanceof Error ? error.message : "Unable to load products.");
      throw error;
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    if (!getAccessToken()) {
      setCartItems([]);
      return;
    }
    const result = await apiRequest("/cart");
    setCartItems(
      result.items.map((item) => ({
        id: item.product.id || item.product._id,
        quantity: item.quantity,
      })),
    );
  }, []);

  useEffect(() => {
    Promise.resolve().then(refreshProducts).catch(() => {});
  }, [refreshProducts]);

  useEffect(() => {
    const handleAuthChange = () => {
      refreshCart().catch((error) => {
        console.error("Unable to load the cart:", error);
      });
    };
    handleAuthChange();
    window.addEventListener("authchange", handleAuthChange);
    return () => window.removeEventListener("authchange", handleAuthChange);
  }, [refreshCart]);

  // Get product quantity
  const getItemQuantity = (id) => {
    return cartItems.find((item) => item.id === String(id))?.quantity || 0;
  };

  const requireLogin = () => {
    if (!getAccessToken()) throw new Error("Please sign in before using your cart.");
  };

  const increaseCartQuantity = async (id) => {
    requireLogin();
    const product = products.find((item) => item.id === String(id));
    if (!product) throw new Error("Product not found.");
    if (getItemQuantity(id) >= getProductStock(product, selectedBranch.id)) {
      throw new Error("There is not enough stock for this product.");
    }
    const result = await apiRequest("/cart/items", {
      method: "POST",
      body: { productId: String(id), quantity: 1 },
    });
    setCartItems(
      result.items.map((item) => ({
        id: item.product.id || item.product._id,
        quantity: item.quantity,
      })),
    );
  };

  // Called when the branch changes: trim quantities to the new branch's stock
  const clampCartToBranch = async (branchId) => {
    const changes = cartItems.map((item) => {
      const product = products.find((product) => product.id === item.id);
      return {
        ...item,
        quantity: Math.min(item.quantity, getProductStock(product, branchId)),
      };
    });
    const changed = changes.some(
      (item, index) => item.quantity !== cartItems[index].quantity,
    );
    if (!changed || !getAccessToken()) return changed;

    const results = await Promise.all(
      changes.map((item) =>
        item.quantity === 0
          ? apiRequest(`/cart/items/${item.id}`, { method: "DELETE" })
          : item.quantity !== cartItems.find((current) => current.id === item.id)?.quantity
            ? apiRequest(`/cart/items/${item.id}`, {
                method: "PATCH",
                body: { quantity: item.quantity },
              })
            : null,
      ),
    );
    void results;
    setCartItems(changes.filter((item) => item.quantity > 0));
    return true;
  };

  // Decrease product quantity
  const decreaseCartQuantity = async (id) => {
    requireLogin();
    const quantity = getItemQuantity(id);
    if (quantity <= 1) return removeItemFromCart(id);
    await updateCartQuantity(id, quantity - 1);
  };

  // Update quantity directly
  const updateCartQuantity = async (id, quantity) => {
    requireLogin();
    const result = await apiRequest(`/cart/items/${id}`, {
      method: "PATCH",
      body: { quantity },
    });
    setCartItems(
      result.items.map((item) => ({
        id: item.product.id || item.product._id,
        quantity: item.quantity,
      })),
    );
  };

  const removeItemFromCart = async (id) => {
    requireLogin();
    const result = await apiRequest(`/cart/items/${id}`, { method: "DELETE" });
    setCartItems(
      result.items.map((item) => ({
        id: item.product.id || item.product._id,
        quantity: item.quantity,
      })),
    );
  };

  const clearCart = async () => {
    requireLogin();
    await apiRequest("/cart", { method: "DELETE" });
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        products,
        productsLoading,
        productsError,
        refreshProducts,
        getItemQuantity,
        clampCartToBranch,
        increaseCartQuantity,
        decreaseCartQuantity,
        updateCartQuantity,
        RemoveItemFromCart: removeItemFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
