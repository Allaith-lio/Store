
import { createContext, useContext, useState } from "react";

const CartContext = createContext({});

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Get product quantity
  const getItemQuantity = (id) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };

  // Add product or increase its quantity
  const increaseCartQuantity = (id) => {
    console.log("Adding to cart:", id);
    setCartItems((currItems) => {
      const existingItem = currItems.find((item) => item.id === id);

      if (!existingItem) {
        return [...currItems, { id, quantity: 1 }];
      }

      return currItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
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
    if (quantity < 1) return;

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

export const useShoppingCart = () => {
  return useContext(CartContext);
};
