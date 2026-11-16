
import { useState } from "react";
import { useBranch } from "./useBranch";
import { CartContext } from "./CartContextValue";
import {
  getCatalogProducts,
  getProductStock,
} from "../services/branchService";

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { selectedBranch } = useBranch();

  // Get product quantity
  const getItemQuantity = (id) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };

  // Add product or increase its quantity
  const increaseCartQuantity = (id) => {
    const product = getCatalogProducts().find((item) => item.id === id);
    const availableStock = getProductStock(product, selectedBranch.id);
    if (!product || availableStock <= 0) return;

    setCartItems((currItems) => {
      const existingItem = currItems.find((item) => item.id === id);

      if (!existingItem) {
        return [...currItems, { id, quantity: 1 }];
      }
      if (existingItem.quantity >= availableStock) return currItems;

      return currItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  // Called when the branch changes: trim quantities to the new branch's stock
  const clampCartToBranch = (branchId) => {
    const total = (items) => items.reduce((sum, item) => sum + item.quantity, 0);
    const next = cartItems
      .map((item) => {
        const product = getCatalogProducts().find((p) => p.id === item.id);
        const stock = getProductStock(product, branchId);
        return { ...item, quantity: Math.min(item.quantity, stock) };
      })
      .filter((item) => item.quantity > 0);

    setCartItems(next);
    return total(next) !== total(cartItems); // true if something changed
  };

  // Decrease product quantity
  const decreaseCartQuantity = (id) => {
    setCartItems((currItems) => {
      const item = currItems.find((item) => item.id === id);

      if (!item) return currItems;

      if (item.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      }

      return currItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  // Update quantity directly
  const updateCartQuantity = (id, quantity) => {
    const product = getCatalogProducts().find((item) => item.id === id);
    const availableStock = getProductStock(product, selectedBranch.id);
    if (quantity < 1 || quantity > availableStock) return;

    setCartItems((currItems) =>
      currItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Remove product
  const RemoveItemFromCart = (id) => {
    setCartItems((currItems) =>
      currItems.filter((item) => item.id !== id)
    );
  };
  // Clear Cart from Peoducts
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        getItemQuantity,
        clampCartToBranch,
        increaseCartQuantity,
        decreaseCartQuantity,
        updateCartQuantity,
        RemoveItemFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
