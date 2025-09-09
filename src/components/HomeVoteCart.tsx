"use client";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

type CardProduct = {
    id: string;
    name: string;
    brand: string;
    image_url: string;
    price: number;
    goal_likes: number;
};

type HomeVoteCartProps = {
    products: CardProduct[];
    user: User | null;
};

export default function HomeVoteCart({ products, user }: HomeVoteCartProps) {
    return (
        <section className="py-10 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">Vote pour ta paire</h2>
                    <Link href="/products">
            <span className="inline-block px-6 py-2 bg-black text-white font-semibold rounded-full text-base hover:bg-gray-900 transition">
              Voir tout le catalogue
            </span>
                    </Link>
                </div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.slice(0, 4).map((prod) => (
                        <ProductCard key={prod.id} product={prod} user={user} />
                    ))}
                </div>
            </div>
        </section>
    );
}
