"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { getVoteWindowStart } from "@/lib/voteWindow";


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
    const [confirmProduct, setConfirmProduct] = useState<Product | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

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
                .gte("created_at", getVoteWindowStart())
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

    const handleOpenConfirm = (product: Product) => setConfirmProduct(product);

    const handleConfirmChange = (open: boolean) => {
        if (!open) {
            setConfirmProduct(null);
        }
    };

    const parseResponse = async (response: Response) => {
        try {
            return await response.json();
        } catch {
            return null;
        }
    };

    const handleUnlike = async () => {
        if (!user || !confirmProduct) return;

        setActionLoading(true);

        try {
            const response = await fetch("/api/votes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: confirmProduct.id }),
            });

            const payload = await parseResponse(response);
            setActionLoading(false);

            if (!response.ok) {
                if (response.status === 401) {
                    toast.info("Connecte-toi pour gérer tes likes.");
                } else if (response.status === 404) {
                    toast.info(payload?.message ?? "Aucun like récent à retirer.");
                } else {
                    toast.error(payload?.message ?? "Impossible de retirer ce like, réessaie.");
                }
                setConfirmProduct(null);
                return;
            }

            toast.success(payload?.message ?? "Le produit a bien été retiré de tes likes.");
            setLiked((prev) => prev.filter((p) => p.id !== confirmProduct.id));
            setConfirmProduct(null);
        } catch {
            setActionLoading(false);
            toast.error("Impossible de retirer ce like, réessaie.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                {/* NON CONNECTÉ */}
                {!user && (
                    <div className="flex flex-col items-center w-full max-w-xl mx-auto py-16">
                        <Heart className="w-12 h-12 text-accent mb-3" fill="#7CFF6B" />
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 tracking-tight text-accent">
                            UNE PAIRE VOUS FAIT DE L&apos;OEIL ? {/* ✅ apostrophe échappée */}
                        </h2>
                        <div className="text-gray-600 text-center text-lg md:text-xl mb-8 max-w-xl leading-snug">
                            Ever wish you could save all your fave fits &amp; accessories in one place to come back
                            to later? Almost like a <span className="font-semibold">✨ wishlist ✨</span>.
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <Link href="/sign-up" className="w-full sm:w-auto">
                                <Button className="rounded-full px-8 py-4 text-lg font-bold w-full sm:w-auto bg-black text-white border border-black transition-colors hover:bg-accent hover:text-black">
                                    CRÉER UN COMPTE
                                </Button>
                            </Link>
                            <Link href="/sign-in" className="w-full sm:w-auto">
                                <Button className="rounded-full px-8 py-4 text-lg font-bold w-full sm:w-auto bg-black text-white border border-black transition-colors hover:bg-accent hover:text-black">
                                    SE CONNECTER
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* LOADING */}
                {user && loading && (
                    <div className="flex flex-col items-center justify-center min-h-[30vh] text-xl text-accent">
                        Chargement…
                    </div>
                )}

                {/* CONNECTÉ, WISHLIST VIDE */}
                {user && !loading && liked.length === 0 && (
                    <div className="flex flex-col items-center w-full max-w-xl mx-auto py-16">
                        <Heart className="w-12 h-12 text-accent mb-3" />
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-accent">Ta wishlist est vide</h2>
                        <div className="text-gray-600 text-center mb-7 text-lg">
                            Like tes paires préférées pour les retrouver ici.
                        </div>
                        <Link href="/products">
                            <Button className="rounded-full px-8 py-4 text-lg font-bold border border-accent bg-black text-white transition-colors hover:bg-accent hover:text-black">
                                Voir les produits
                            </Button>
                        </Link>
                    </div>
                )}

                {/* CONNECTÉ, AVEC LIKES */}
                {user && !loading && liked.length > 0 && (
                    <div className="w-full max-w-4xl mx-auto py-6">
                        <h1 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2 justify-center text-accent">
                            <Heart className="w-7 h-7 text-accent" fill="#7CFF6B" />
                            Mes paires likées
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {liked.map((prod) => (
                                <Link href={`/products/${prod.id}`} key={prod.id} className="block group">
                                    <div className="bg-white rounded-2xl shadow hover:shadow-xl hover:scale-[1.015] transition flex flex-col items-center p-5 border border-transparent hover:border-accent">
                                        <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                                            <img
                                                src={prod.images?.[0] || "/placeholder.svg"}
                                                alt={prod.title}
                                                className="object-contain"
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="default"
                                                className="absolute top-3 right-3 rounded-full border border-accent bg-black text-white transition-colors hover:bg-accent hover:text-black"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    handleOpenConfirm(prod);
                                                }}
                                                aria-label="Retirer ce produit de mes likes"
                                            >
                                                <Heart className="w-5 h-5" fill="#7CFF6B" color="#7CFF6B" />
                                            </Button>
                                        </div>
                                        <div className="font-bold text-lg mb-1 truncate w-full text-center text-accent group-hover:text-accent-muted transition-colors">
                                            {prod.title}
                                        </div>
                                        <div className="text-gray-600 text-sm mb-2 w-full text-center">{prod.brand}</div>
                                        <div className="font-semibold text-xl mb-2 w-full text-center text-accent">{prod.price} €</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <ConfirmDialog
                open={!!confirmProduct}
                onOpenChange={handleConfirmChange}
                title="Retirer cette paire de tes likes ?"
                description={
                    confirmProduct && (
                        <span>
                            Tu pourras toujours revenir liker la <span className="font-semibold">{confirmProduct.title}</span> plus tard.
                        </span>
                    )
                }
                confirmLabel="Retirer"
                onConfirm={handleUnlike}
                confirmLoading={actionLoading}
            />
            <Footer />
        </div>
    );
}
