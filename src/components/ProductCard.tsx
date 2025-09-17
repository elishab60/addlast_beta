"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type ProductCardProps = {
    product: {
        id: string;
        name: string;
        brand: string;
        image_url: string;
        price: number;
        goal_likes: number;
    };
    user: User | null; // ✅ typage
    onVoted?: () => void;
};

export default function ProductCard({ product, user, onVoted }: ProductCardProps) {
    const [votesCount, setVotesCount] = useState(0);
    const [userVoted, setUserVoted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchVotes();
        if (user) checkUserVote();
        // eslint-disable-next-line
    }, [user]);

    async function fetchVotes() {
        const { count } = await supabase
            .from("votes")
            .select("*", { count: "exact", head: true })
            .eq("product_id", product.id)
            .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString());
        setVotesCount(count || 0);
    }

    async function checkUserVote() {
        const { data } = await supabase
            .from("votes")
            .select("*")
            .eq("user_id", user?.id)
            .eq("product_id", product.id)
            .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString());
        setUserVoted(!!(data && data.length));
    }

    async function handleVote(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.info("Connecte-toi pour voter !");
            return;
        }

        setLoading(true);
        const { data: userVotes } = await supabase
            .from("votes")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString());

        if (userVotes?.find((v) => v.product_id === product.id)) {
            toast.info("Tu as déjà voté pour cette paire ce mois-ci !");
            setLoading(false);
            return;
        }
        if ((userVotes?.length || 0) >= 2) {
            setShowModal(true);
            setLoading(false);
            return;
        }

        const { error } = await supabase.from("votes").insert({
            user_id: user.id,
            product_id: product.id,
        });
        setLoading(false);

        if (!error) {
            toast.success("Ton vote a bien été pris en compte !");
            setUserVoted(true);
            fetchVotes();
            if (onVoted) onVoted();
        } else {
            toast.error("Erreur lors du vote, réessaie.");
        }
    }

    const percent = Math.min(100, (votesCount / product.goal_likes) * 100);

    return (
        <Link
            href={`/products/${product.id}`}
            className="block group cursor-pointer"
            prefetch={false}
        >
            <Card className="hover:scale-[1.025] hover:shadow-lg transition relative">
                <CardHeader className="pb-2">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-2 bg-muted/30">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                            loading="lazy"
                            width={300}
                            height={225}
                        />
                    </div>
                    <CardTitle className="text-lg font-semibold truncate">{product.name}</CardTitle>
                    <div className="text-sm text-muted-foreground">{product.brand}</div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-xl">{product.price}€</span>
                        <Button
                            variant={userVoted ? "default" : "outline"}
                            disabled={userVoted || loading}
                            onClick={handleVote}
                            size="icon"
                            className="rounded-full w-14 h-14 text-red-600 border-2 border-red-500 bg-red-50 hover:bg-red-100 shadow-lg text-2xl flex items-center justify-center transition-all"
                            aria-label={userVoted ? "Déjà voté" : "Voter"}
                            tabIndex={0}
                        >
                            <Heart fill={userVoted ? "#ef4444" : "none"} className="w-8 h-8 transition-all" />
                        </Button>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{votesCount} / {product.goal_likes} likes</span>
                            <span>{Math.round(percent)}%</span>
                        </div>
                        <Progress value={percent} className="h-2 rounded-full" />
                    </div>
                </CardContent>
                {/* Modal limitation de votes */}
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Limite de votes atteinte</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                            <p>
                                Tu as déjà voté pour 2 paires différentes ce mois-ci.<br />
                                Retente le mois prochain ou retire un vote depuis ton profil.
                            </p>
                        </div>
                        <Button onClick={() => setShowModal(false)} className="mt-2 w-full">
                            Fermer
                        </Button>
                    </DialogContent>
                </Dialog>
            </Card>
        </Link>
    );
}
