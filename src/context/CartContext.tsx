"use client";
import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
    productId: string;
    name: string;
    image: string;
    size: string;
    price: number;
    quantity: number;
};

type CartContextProps = {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    count: number;
};

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("CartContext must be used in provider");
    return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const local = localStorage.getItem("cart");
        if (local) setItems(JSON.parse(local));
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (item: CartItem) => {
        setItems((prev) => {
            // Additionne quantités sur le même produit/taille
            const found = prev.find(
                (it) => it.productId === item.productId && it.size === item.size
            );
            if (found) {
                return prev.map((it) =>
                    it.productId === item.productId && it.size === item.size
                        ? { ...it, quantity: it.quantity + item.quantity }
                        : it
                );
            }
            return [...prev, item];
        });
    };

    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, count }}>
            {children}
        </CartContext.Provider>
    );
}
