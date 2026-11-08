import { createContext, useContext, useState } from "react";

const CartContext = createContext({});

const CartContextProvider = ({ children }) => {
  const [cartItems, SetCartItems] = useState([]);
  const getItemQuantity = (id) => {
  return cartItems.find((item) => item.id === id)?.quantity || 0;
};
  const increaseCartQuantity = (id) => {
    SetCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  };
const decreaseCartQuantity = (id) => {
  SetCartItems((currItems) => {
    const item = currItems.find((item) => item.id === id);

    if (!item) {
      return currItems;
    }

    if (item.quantity === 1) {
      return currItems.filter((item) => item.id !== id);
    }

    return currItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity - 1 };
      }

      return item;
    });
  });
};
  const RemoveItemFromCart = (id) => {
    SetCartItems((currItems) => currItems.filter((item) => item.id !== id));
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        RemoveItemFromCart,
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
