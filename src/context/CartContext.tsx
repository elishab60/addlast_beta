"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
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
    removeFromCart: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number) => void;
    clearCart: () => void;
    count: number;
    total: number;
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

    const removeFromCart = (productId: string, size: string) => {
        setItems((prev) => prev.filter((item) => item.productId !== productId || item.size !== size));
    };

    const updateQuantity = (productId: string, size: string, quantity: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.productId === productId && item.size === size
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        );
    };

    const clearCart = () => setItems([]);

    const { count, total } = useMemo(() => {
        return {
            count: items.reduce((sum, item) => sum + item.quantity, 0),
            total: items.reduce((sum, item) => sum + item.quantity * item.price, 0),
        };
    }, [items]);

    return (
        <CartContext.Provider
            value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, count, total }}
        >
            {children}
        </CartContext.Provider>
    );
}
