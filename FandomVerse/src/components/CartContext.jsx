import { createContext, useReducer, useContext, useMemo } from "react";
const CartContext = createContext(null);
const initialCart = { items: [] };
const cartReducer = (state, action) => {
    switch (action.type){
        case 'ADD_TO_CART': {
            const merchandise = action.payload;
            const existingMerchandise = state.items.find((item) => item.id === merchandise.id);

            if (existingMerchandise) {
                return {
                    items: state.items.map((item) => item.id === merchandise.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item)
                };
            }
            return {
                items: [...state.items, { ...merchandise, quantity: 1 }]
            };
        }
        case 'REMOVE_FROM_CART':
            return {
                items: state.items.filter((item) => item.id !== action.payload)
            };
        case 'SET_QUANTITY': {
                const { id, quantity } = action.payload;
                if (quantity <= 0) return { items: state.items.filter((i) => i.id !== id) };
                return {
                    items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
                };
        }
        case 'CLEAR_CART': {
            return initialCart;
        }
        case 'INCREMENT':{
            return {items: state.items.map(i => i.id === action.payload ? { ...i, qty: i.qty + 1 } : i) }
        };
        case 'DECREMENT':{
            return {items: state.items.map(i => i.id === action.payload ? { ...i, qty: i.qty - 1 } : i)}
        }
        default:
            return state;
    }
};

const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, initialCart);

    const value = useMemo(() => {
        const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
        const subtotal = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
        
        return {
            items: cart.items,
            totalItems,
            subtotal,
            addItems: (merchandise) => dispatch({ type: 'ADD_TO_CART', payload: merchandise }),
            removeItems: (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id }),
            setQuantity: (id, quantity) => dispatch({ type: 'SET_QUANTITY', payload: { id, quantity } }),
            clearCart: () => dispatch({ type: 'CLEAR_CART' }),
            increment: (id) => dispatch({ type: 'INCREMENT', payload: id }),
            decrement: (id) => dispatch({ type: 'DECREMENT', payload: id }),
            isInCart: (id) => cart.items.some((item) => item.id === id),
        };
    }, [cart.items]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
// This module intentionally exports both the provider component and its hook.
// eslint-disable-next-line react-refresh/only-export-components
export { useCart, CartProvider };
