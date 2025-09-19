import React, { ReactNode } from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { CartProvider, useCart, CartItem } from "../CartContext";

describe("CartContext", () => {
    const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

    const sampleItem: CartItem = {
        productId: "product-1",
        name: "Sneaker",
        image: "/sneaker.jpg",
        size: "42",
        price: 120,
        quantity: 1,
    };

    beforeEach(() => {
        localStorage.clear();
    });

    it("merges quantities when adding the same product twice", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(sampleItem);
            result.current.addToCart({ ...sampleItem, quantity: 2 });
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].quantity).toBe(3);
        expect(result.current.total).toBe(360);
    });

    it("removes items and updates counters", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(sampleItem);
            result.current.addToCart({ ...sampleItem, productId: "product-2", quantity: 2 });
        });

        expect(result.current.count).toBe(3);

        act(() => {
            result.current.removeFromCart(sampleItem.productId, sampleItem.size);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.count).toBe(2);
        expect(result.current.total).toBe(240);
    });

    it("prevents quantities from dropping below 1", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(sampleItem);
            result.current.updateQuantity(sampleItem.productId, sampleItem.size, 0);
        });

        expect(result.current.items[0].quantity).toBe(1);
    });
});
