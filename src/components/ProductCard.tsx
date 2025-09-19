"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
    fetchVoteStatus,
    voteForProduct,
    removeVoteForProduct,
} from "@/lib/voteApi";

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
    const [showUnvoteConfirm, setShowUnvoteConfirm] = useState(false);
    const userId = user?.id;

    const refreshVoteStatus = useCallback(async () => {
        try {
            const status = await fetchVoteStatus(product.id);
            setVotesCount(status.votes);
            setUserVoted(userId ? status.userVoted : false);
        } catch (error) {
            console.error("Failed to fetch vote status", error);
        }
    }, [product.id, userId]);

    useEffect(() => {
        refreshVoteStatus();
    }, [refreshVoteStatus]);

    async function handleVote(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.info("Connecte-toi pour voter !");
            return;
        }

        if (userVoted) {
            setShowUnvoteConfirm(true);
            return;
        }

        setLoading(true);

        try {
            const result = await voteForProduct(product.id);
            setLoading(false);

            if (!result.ok) {
                if (result.status === 401) {
                    toast.info("Connecte-toi pour voter !");
                } else if (result.status === 409) {
                    toast.info(result.message || "Tu as déjà liké cette paire.");
                } else {
                    toast.error(result.message || "Erreur lors du vote, réessaie.");
                }
                return;
            }

            toast.success(result.message || "Ton vote a bien été pris en compte !");
            await refreshVoteStatus();
            if (onVoted) onVoted();
        } catch (error) {
            setLoading(false);
            console.error("Failed to vote", error);
            toast.error("Erreur lors du vote, réessaie.");
        }
    }

    async function handleUnvote() {
        if (!user) return;

        setLoading(true);
        try {
            const result = await removeVoteForProduct(product.id);
            setLoading(false);
            setShowUnvoteConfirm(false);

            if (!result.ok) {
                if (result.status === 401) {
                    toast.info("Connecte-toi pour gérer tes likes.");
                } else if (result.status === 404) {
                    toast.info(result.message || "Aucun like récent à retirer.");
                } else {
                    toast.error(result.message || "Impossible de retirer ton like, réessaie.");
                }
                return;
            }

            toast.success(result.message || "Ton like a bien été retiré.");
            await refreshVoteStatus();
            if (onVoted) onVoted();
        } catch (error) {
            setLoading(false);
            setShowUnvoteConfirm(false);
            console.error("Failed to remove vote", error);
            toast.error("Impossible de retirer ton like, réessaie.");
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
                            disabled={loading}
                            onClick={handleVote}
                            size="icon"
                            className="rounded-full w-14 h-14 text-red-600 border-2 border-red-500 bg-red-50 hover:bg-red-100 shadow-lg text-2xl flex items-center justify-center transition-all"
                            aria-label={userVoted ? "Retirer mon like" : "Voter"}
                            aria-pressed={userVoted}
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
                <ConfirmDialog
                    open={showUnvoteConfirm}
                    onOpenChange={setShowUnvoteConfirm}
                    title="Retirer ton like ?"
                    description="Tu pourras revenir liker cette paire plus tard si tu changes d'avis."
                    confirmLabel="Retirer"
                    onConfirm={handleUnvote}
                    confirmLoading={loading}
                />
            </Card>
        </Link>
    );
}
