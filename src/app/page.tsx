"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HeroHowItWorks";
import HeroSection from "@/components/HeroSection";
import SocialMediaBentoGrid from "@/components/social-media-bento-grid"
import CatalogCarousel from "@/components/CatalogCarousel";
import { Product } from "@/types"
import type { User } from "@supabase/supabase-js"

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([])
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
        const fetchProducts = async () => {
            const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false })
            setProducts(data || [])
        }
        fetchProducts()
    }, [])

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-1 flex flex-col">
                <HeroSection/>
                <HowItWorks/>
                <CatalogCarousel products={products} user={user}/>
                <SocialMediaBentoGrid />
            </main>
            <Footer />
        </div>
    );
}
