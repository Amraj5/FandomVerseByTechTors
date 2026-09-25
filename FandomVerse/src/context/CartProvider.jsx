import { useReducer, useMemo } from "react";
import { CartContext } from "./CartContext";


const initialCart = { items: [] };

const parsePrice = (priceString) => {
  const n = Number(String(priceString).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const toCartItem = (merchandise) => ({
  id: merchandise.id,
  title: merchandise.title,
  price: parsePrice(merchandise.price),
  imageUrl: merchandise.imageUrl,
});

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const merchandise = action.payload;
      const existing = state.items.find((i) => i.id === merchandise.id);

      if (existing) {
        return {
          items: state.items.map((i) =>i.id === merchandise.id ? { ...i, quantity: i.quantity + 1 }: i),
        };
      }
      return { items: [...state.items, { ...merchandise, quantity: 1 }] };
    }

    case "REMOVE_FROM_CART":
      return { items: state.items.filter((i) => i.id !== action.payload) };

    case "SET_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.id !== id) };
      }
      return {
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      };
    }

    case "INCREMENT":
      return {
        items: state.items.map((i) => i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i),
      };

    case "DECREMENT":
      return {
        items: state.items.map((i) => i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0),
        };

    case "CLEAR_CART":{
      return initialCart
    };

    default:
      return state;
  }
};


export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  const value = useMemo(() => {
    const totalItems = cart.items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = cart.items.reduce(
      (total, i) => total + i.quantity * i.price,
      0
    );

    return {
      items: cart.items,
      totalItems,
      subtotal,

      addItems: (merchandise) =>{
        dispatch({ type: "ADD_TO_CART", payload: toCartItem(merchandise) })},
      removeItems: (id) =>{ dispatch({ type: "REMOVE_FROM_CART", payload: id })},
      setQuantity: (id, quantity) =>{dispatch({ type: "SET_QUANTITY", payload: { id, quantity } })},
      increment: (id) => {dispatch({ type: "INCREMENT", payload: id })},
      decrement: (id) => {dispatch({ type: "DECREMENT", payload: id })},
      clearCart: () => {dispatch({ type: "CLEAR_CART" })},

      isInCart: (id) => cart.items.some((i) => i.id === id),
    };
  }, [cart.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};