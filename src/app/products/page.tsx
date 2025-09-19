"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Loader2, PlusCircle, SlidersHorizontal, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ Type produit
type Product = {
    id: string;
    title: string;
    brand: string;
    model: string;
    image_url: string;
    created_at: string;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [brandFilter, setBrandFilter] = useState("");
    const [modelFilter, setModelFilter] = useState("");
    const [user, setUser] = useState<User | null>(null);

    // Fetch user connecté
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    }, []);

    // Fetch produits
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("products")
                .select("id, title, brand, model, image_url, created_at")
                .order("created_at", { ascending: false });

            if (!error && data) setProducts(data as Product[]);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    // Récupération des marques et modèles uniques
    const brands = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);
    const models = Array.from(
        new Set(
            products
                .filter((p) => (brandFilter ? p.brand === brandFilter : true))
                .map((p) => p.model)
        )
    ).filter(Boolean);

    // Filtrage recherche + filtres
    const filtered = products.filter((prod) => {
        const matchesSearch = prod.title
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesBrand = brandFilter ? prod.brand === brandFilter : true;
        const matchesModel = modelFilter ? prod.model === modelFilter : true;
        return matchesSearch && matchesBrand && matchesModel;
    });

    return (
        <div className="min-h-screen flex flex-col bg-white text-black">
            <Header />

            {/* Hero */}
            <section className="w-full border-b border-border pt-16 pb-12 px-4 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-accent">
                        Catalogue des Sneakers
                    </h1>
                    <p className="text-lg text-black/70 leading-relaxed">
                        Explorez toutes les paires actuelles et passées.
                        Découvrez leur histoire et leurs spécificités.
                        Pour voter ou précommander, rendez-vous dans les sections{" "}
                        <Link
                            href="/votes"
                            className="text-black underline transition-colors hover:text-accent"
                        >
                            Votes
                        </Link>{" "}
                        et{" "}
                        <Link
                            href="/precommandes"
                            className="text-black underline transition-colors hover:text-accent"
                        >
                            Précommandes
                        </Link>.
                    </p>
                </div>
            </section>

            {/* Section catalogue */}
            <main className="container flex-1 mx-auto py-12 px-4 space-y-12">
                {/* Filtres */}
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                    {/* Recherche */}
                    <Input
                        type="text"
                        placeholder="Rechercher une paire…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full lg:w-[300px] border border-border transition-all duration-300 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent"
                    />

                    {/* Selects filtres */}
                    <div className="flex flex-wrap gap-4">
                        <Select onValueChange={(val) => setBrandFilter(val)} value={brandFilter}>
                            <SelectTrigger className="w-[180px] border border-border focus:border-accent">
                                <SelectValue placeholder="Filtrer par marque" />
                            </SelectTrigger>
                            <SelectContent>
                                {brands.map((b) => (
                                    <SelectItem key={b} value={b}>
                                        {b}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            onValueChange={(val) => setModelFilter(val)}
                            value={modelFilter}
                            disabled={!brandFilter}
                        >
                            <SelectTrigger className="w-[200px] border border-border disabled:opacity-50 focus:border-accent">
                                <SelectValue placeholder="Filtrer par modèle" />
                            </SelectTrigger>
                            <SelectContent>
                                {models.map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {(brandFilter || modelFilter || search) && (
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 text-black hover:text-accent-muted hover:bg-black-muted"
                                onClick={() => {
                                    setBrandFilter("");
                                    setModelFilter("");
                                    setSearch("");
                                }}
                            >
                                <X size={16} /> Réinitialiser
                            </Button>
                        )}
                    </div>
                </div>

                {/* Grille produits */}
                {loading ? (
                    <div className="flex justify-center items-center h-40 text-accent">
                        <Loader2 className="animate-spin mr-2" /> Chargement…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center text-black py-24">
                        Aucun produit trouvé.
                    </div>
                ) : (
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {filtered.map((prod) => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                )}

                {/* CTA proposer une paire */}
                <div className="text-center space-y-4 pt-12 border-t border-border">
                    <p className="text-black/70">
                        Une paire que vous aimeriez revoir ? Proposez-la, notre équipe
                        analysera vos suggestions pour de futures campagnes.
                    </p>
                    <Link href="/proposer">
                        <Button
                            size="lg"
                            className="bg-black text-white border border-black transition-colors hover:bg-accent hover:text-black"
                        >
                            <PlusCircle size={18} /> Proposer une paire
                        </Button>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}

/* -------------------- Card Produit -------------------- */
function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/products/${product.id}`} className="block group">
            <Card className="border border-border bg-white hover:border-accent hover:shadow-xl hover:scale-[1.02] transition-transform duration-300">
                <CardHeader className="pb-2">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-black/5">
                        <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                    <CardTitle className="mt-3 text-lg font-semibold truncate text-black group-hover:text-accent-muted transition-colors">
                        {product.title}
                    </CardTitle>
                </CardHeader>
            </Card>
        </Link>
    );
}
