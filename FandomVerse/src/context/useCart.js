// context/useCart.js
import { useContext } from "react";

import { createContext } from "react";

const CartContext = createContext(null);
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};