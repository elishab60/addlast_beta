"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { User } from "@supabase/supabase-js";


type Product = {
    id: string;
    title: string;
    brand: string;
    images: string[];
    price: number;
};

export default function WishlistPage() {
    const [user, setUser] = useState<User | null>(null);
    const [liked, setLiked] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    }, []);

    useEffect(() => {
        if (!user) return setLoading(false);
        const fetchLikes = async () => {
            setLoading(true);
            const { data: votes } = await supabase
                .from("votes")
                .select("product_id")
                .eq("user_id", user.id)
                .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString())
                .limit(2);

            if (votes && votes.length > 0) {
                const { data: products } = await supabase
                    .from("products")
                    .select("id, title, brand, images, price")
                    .in(
                        "id",
                        votes.map((v) => v.product_id)
                    );
                setLiked((products as Product[]) || []);
            } else {
                setLiked([]);
            }
            setLoading(false);
        };
        fetchLikes();
    }, [user]);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                {/* NON CONNECTÉ */}
                {!user && (
                    <div className="flex flex-col items-center w-full max-w-xl mx-auto py-16">
                        <Heart className="w-12 h-12 text-black mb-3" fill="black" />
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 tracking-tight">
                            UNE PAIRE VOUS FAIT DE L&apos;OEIL ? {/* ✅ apostrophe échappée */}
                        </h2>
                        <div className="text-gray-600 text-center text-lg md:text-xl mb-8 max-w-xl leading-snug">
                            Ever wish you could save all your fave fits &amp; accessories in one place to come back
                            to later? Almost like a <span className="font-semibold">✨ wishlist ✨</span>.
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <Link href="/sign-up" className="w-full sm:w-auto">
                                <Button className="rounded-full px-8 py-4 text-lg font-bold w-full sm:w-auto bg-black text-white hover:bg-gray-900">
                                    CRÉER UN COMPTE
                                </Button>
                            </Link>
                            <Link href="/sign-in" className="w-full sm:w-auto">
                                <Button className="rounded-full px-8 py-4 text-lg font-bold w-full sm:w-auto bg-black text-white hover:bg-gray-900">
                                    SE CONNECTER
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* LOADING */}
                {user && loading && (
                    <div className="flex flex-col items-center justify-center min-h-[30vh] text-xl text-gray-500">
                        Chargement…
                    </div>
                )}

                {/* CONNECTÉ, WISHLIST VIDE */}
                {user && !loading && liked.length === 0 && (
                    <div className="flex flex-col items-center w-full max-w-xl mx-auto py-16">
                        <Heart className="w-12 h-12 text-gray-400 mb-3" />
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Ta wishlist est vide</h2>
                        <div className="text-gray-600 text-center mb-7 text-lg">
                            Like tes paires préférées pour les retrouver ici.
                        </div>
                        <Link href="/products">
                            <Button className="rounded-full px-8 py-4 text-lg font-bold">Voir les produits</Button>
                        </Link>
                    </div>
                )}

                {/* CONNECTÉ, AVEC LIKES */}
                {user && !loading && liked.length > 0 && (
                    <div className="w-full max-w-4xl mx-auto py-6">
                        <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2 justify-center">
                            <Heart className="w-7 h-7 text-black" fill="black" />
                            Mes paires likées
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {liked.map((prod) => (
                                <Link href={`/products/${prod.id}`} key={prod.id} className="block group">
                                    <div className="bg-white rounded-2xl shadow hover:shadow-xl hover:scale-[1.015] transition flex flex-col items-center p-5">
                                        <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                                            <img
                                                src={prod.images?.[0] || "/placeholder.svg"}
                                                alt={prod.title}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="font-bold text-lg mb-1 truncate w-full text-center">{prod.title}</div>
                                        <div className="text-gray-600 text-sm mb-2 w-full text-center">{prod.brand}</div>
                                        <div className="font-semibold text-xl mb-2 w-full text-center">{prod.price} €</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
