// src/types/product.ts
export type Product = {
    id: string;
    brand: string;
    model: string;
    title: string;
    price: number;
    sizes: string[];
    colors: string[];
    stock: number;
    image_url: string;
    images?: string[];
    description?: string;
    descriptions?: { title: string; content: string }[];
    features?: { label: string; value: string }[];
    created_at?: string;
    updated_at?: string;
};
