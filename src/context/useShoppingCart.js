import { useContext } from "react";
import { CartContext } from "./CartContextValue";

export function useShoppingCart() {
  return useContext(CartContext);
}
