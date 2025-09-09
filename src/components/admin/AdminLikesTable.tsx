// components/admin/AdminLikesTable.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Product = {
    id: string;
    title: string;
    brand: string;
    price: number | null;
    goal_likes: number | null;
    images: string[] | null;
    created_at?: string | null;
};

type Vote = {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
};

type RangeKey = "7d" | "30d" | "90d" | "all";

const RANGE_OPTS: { key: RangeKey; label: string; days?: number }[] = [
    { key: "7d", label: "7 jours", days: 7 },
    { key: "30d", label: "30 jours", days: 30 },
    { key: "90d", label: "90 jours", days: 90 },
    { key: "all", label: "Tout" },
];

export default function AdminLikesTable() {
    const [products, setProducts] = useState<Product[]>([]);
    const [votes, setVotes] = useState<Vote[]>([]);
    const [votesAllTime, setVotesAllTime] = useState<Vote[]>([]);
    const [range, setRange] = useState<RangeKey>("30d");
    const [loading, setLoading] = useState(true);
    const [loadingVotes, setLoadingVotes] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("products")
                .select("id,title,brand,price,goal_likes,images,created_at")
                .order("created_at", { ascending: false });
            setProducts((data ?? []) as Product[]);
            setLoading(false);
            if (error) console.error(error);
        })();
    }, []);

    // Récup des votes sur période + all-time
    useEffect(() => {
        (async () => {
            setLoadingVotes(true);

            // All-time (pour colonne “Total”)
            const { data: allVotes, error: errAll } = await supabase
                .from("votes")
                .select("id,user_id,product_id,created_at");
            if (!errAll) setVotesAllTime((allVotes ?? []) as Vote[]);

            // Période
            const { days } = RANGE_OPTS.find((o) => o.key === range) || {};
            let query = supabase.from("votes").select("id,user_id,product_id,created_at");
            if (days) {
                query = query.gte("created_at", new Date(Date.now() - days * 24 * 3600 * 1000).toISOString());
            }
            const { data, error } = await query;
            if (!error) setVotes((data ?? []) as Vote[]);
            if (error) console.error(error);
            setLoadingVotes(false);
        })();
    }, [range]);

    const stats = useMemo(() => {
        // Agrégation likes par produit (période)
        const perProduct: Record<string, number> = {};
        for (const v of votes) {
            perProduct[v.product_id] = (perProduct[v.product_id] || 0) + 1;
        }
        // All-time
        const perProductAll: Record<string, number> = {};
        for (const v of votesAllTime) {
            perProductAll[v.product_id] = (perProductAll[v.product_id] || 0) + 1;
        }

        // Fusion sur produits connus (évite d’afficher des IDs orphelins)
        return products.map((p) => {
            const periodLikes = perProduct[p.id] || 0;
            const totalLikes = perProductAll[p.id] || 0;
            const goal = p.goal_likes ?? 100;
            const percent = Math.min(100, (totalLikes / (goal || 1)) * 100);
            return { product: p, periodLikes, totalLikes, goal, percent };
        });
    }, [products, votes, votesAllTime]);

    return (
        <div className="w-full bg-white rounded-xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                    {RANGE_OPTS.map((opt) => (
                        <Button
                            key={opt.key}
                            size="sm"
                            variant={range === opt.key ? "default" : "outline"}
                            onClick={() => setRange(opt.key)}
                        >
                            {opt.label}
                        </Button>
                    ))}
                </div>
                <div className="text-sm text-gray-500">
                    {loading || loadingVotes ? "Chargement…" : `${stats.length} produits`}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr className="bg-gray-50">
                        <Th>Produit</Th>
                        <Th className="w-24 text-right">Likes ({RANGE_OPTS.find((o) => o.key === range)?.label})</Th>
                        <Th className="w-24 text-right">Total</Th>
                        <Th className="w-28 text-right">Objectif</Th>
                        <Th className="w-64">Progression</Th>
                        <Th className="w-24 text-right">Prix</Th>
                        <Th className="w-28 text-right">Actions</Th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {stats.map(({ product, periodLikes, totalLikes, goal, percent }) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition">
                            <td className="px-3 py-3">
                                <div className="flex items-center gap-3">
                                    {product.images?.[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="w-12 h-12 rounded object-contain bg-white border"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded bg-gray-100 border" />
                                    )}
                                    <div className="min-w-0">
                                        <div className="font-semibold truncate">{product.title}</div>
                                        <div className="text-xs text-gray-500 truncate">{product.brand}</div>
                                    </div>
                                </div>
                            </td>

                            <TdRight>{periodLikes}</TdRight>
                            <TdRight>{totalLikes}</TdRight>
                            <TdRight>{goal}</TdRight>

                            <td className="px-3 py-3">
                                <div className="flex items-center gap-3">
                                    <Progress value={percent} className="h-2 w-48 rounded-full" />
                                    <span className="text-xs text-gray-600">{Math.round(percent)}%</span>
                                </div>
                            </td>

                            <TdRight>{product.price ?? 0} €</TdRight>

                            <td className="px-3 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <Link href={`/products/${product.id}`}>
                                        <Button size="sm" variant="outline">Voir</Button>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {!loading && !loadingVotes && stats.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                                Aucun produit ou aucun vote sur la période.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Petit récap */}
            <div className="mt-4 text-sm text-gray-500">
                <p>
                    Les “Likes ({RANGE_OPTS.find((o) => o.key === range)?.label})” comptent les votes dans la période
                    sélectionnée. La progression est basée sur le <strong>Total</strong> par rapport à <strong>goal_likes</strong>.
                </p>
            </div>
        </div>
    );
}

/* ---------- UI helpers ---------- */
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <th className={`px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase ${className}`}>{children}</th>
    );
}
function TdRight({ children }: { children: React.ReactNode }) {
    return <td className="px-3 py-3 text-right">{children}</td>;
}
