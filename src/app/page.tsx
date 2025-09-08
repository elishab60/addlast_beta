"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HeroHowItWorks";
import HomeVoteCart from "@/components/HomeVoteCart";
import HeroSection from "@/components/HeroSection";
import HomeHowItWorks from "@/components/HomeHowItWorks";
import SocialMediaBentoGrid from "@/components/social-media-bento-grid"
import CatalogCarousel from "@/components/CatalogCarousel";



export default function HomePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
        const fetchProducts = async () => {
            const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
            setProducts(data || []);
        };
        fetchProducts();
    }, []);

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
