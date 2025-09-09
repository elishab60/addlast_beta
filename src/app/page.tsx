"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HeroHowItWorks";
import HeroSection from "@/components/HeroSection";
import SocialMediaBentoGrid from "@/components/social-media-bento-grid";
import CatalogCarousel from "@/components/CatalogCarousel";
import type { User } from "@supabase/supabase-js";

/** Format attendu par CatalogCarousel */
type CCProduct = {
    id: string;
    name: string;            // ✅ requis par CatalogCarousel
    brand: string;
    image_url: string;
    price: number;
    goal_likes: number;      // ✅ requis par CatalogCarousel
    status: "En vote" | "En précommande" | "Rupture"; // ✅ requis par CatalogCarousel
};

/** Produit tel qu'on peut le recevoir de la table (champs optionnels) */
type DBProduct = {
    id: string;
    name?: string | null;
    title?: string | null;     // certains schémas utilisent "title" au lieu de "name"
    brand?: string | null;
    image_url?: string | null;
    images?: string[] | null;  // fallback éventuel
    price?: number | null;
    goal_likes?: number | null;
    status?: "En vote" | "En précommande" | "Rupture" | null;
    created_at?: string | null;
};

export default function HomePage() {
    const [products, setProducts] = useState<CCProduct[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));

        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error(error);
                setProducts([]);
                return;
            }

            const rows = (data ?? []) as DBProduct[];

            // 🎯 mapping vers le format attendu par CatalogCarousel
            const mapped: CCProduct[] = rows.map((p) => ({
                id: p.id,
                name: (p.name ?? p.title ?? "").toString(),
                brand: (p.brand ?? "").toString(),
                image_url:
                    p.image_url ??
                    (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "/placeholder.svg"),
                price: typeof p.price === "number" ? p.price : Number(p.price ?? 0),
                goal_likes: typeof p.goal_likes === "number" ? p.goal_likes : Number(p.goal_likes ?? 100),
                status: (p.status ?? "En vote") as CCProduct["status"],
            }));

            setProducts(mapped);
        };

        fetchProducts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-1 flex flex-col">
                <HeroSection />
                <HowItWorks />
                <CatalogCarousel products={products} user={user} />
                <SocialMediaBentoGrid />
            </main>
            <Footer />
        </div>
    );
}
