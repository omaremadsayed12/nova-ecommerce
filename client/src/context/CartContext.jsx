import { useEffect, useState, useContext, createContext } from "react";
import { ToastContext } from "./ToastContext";

export const CartContext = createContext(null);


export default function CartProvider({ children }) {
    const { showSuccess } = useContext(ToastContext);

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("Cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("Cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (productId, quantity = 1) => {
        const newItem = {
            product: productId,
            quantity
        }

        
        if (!inCart(productId)) {
            setCart((Items) => [...Items, newItem]);
            showSuccess("Product added to cart successfully");
        }
        else {
            setCart(
                (Items) => Items.map(item =>
                    item.product === productId ? newItem : item
                )
            )
            showSuccess("Qunatity updated successfully");

        }
    };

    const removeFromCart = (productId) => {
        setCart(
            (Items) => Items.filter(item =>
                item.product != productId
            )
        )
        const resp = "Done";
        showSuccess(resp);
    };

    const inCart = (productId) => {
        return cart.some(item => item.product === productId);
    };


    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                inCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
