"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Loader2, PlusCircle } from "lucide-react";
import ProductCard from "@/components/ProductCard";

type Product = {
    id: string;
    name: string;
    brand: string;
    image_url: string;
    price: number;
    goal_likes: number;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [user, setUser] = useState<any>(null);

    // Fetch user connecté
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    }, []);

    // Fetch produits
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            let { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });
            if (!error && data) setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    // Filtrage recherche
    const filtered = products.filter((prod) =>
        [prod.name, prod.brand].join(" ").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            {/* Hero + barre de recherche */}
            <section className="w-full bg-gradient-to-b from-muted/50 to-background pt-10 pb-4 shadow">
                <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-3xl font-bold tracking-tight">Nos Sneakers d'Exception</h1>
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            placeholder="Rechercher une paire, une marque…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-[250px]"
                        />
                        <Link href="/proposer">
                            <Button size="lg" className="gap-2">
                                <PlusCircle size={18} /> Proposer une paire
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Section catalogue */}
            <main className="container flex-1 mx-auto py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="animate-spin mr-2" /> Chargement…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center text-muted-foreground py-24">Aucun produit trouvé.</div>
                ) : (
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filtered.map(prod => (
                            <ProductCard key={prod.id} product={prod} user={user} />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
