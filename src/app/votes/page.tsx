"use client"

import { useCallback, useEffect, useState, type KeyboardEvent, type MouseEvent } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Trophy, Users, Clock } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { getVoteWindowStart } from "@/lib/voteWindow"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { useRouter } from "next/navigation"
import { createVote, removeVote } from "@/lib/votesClient"

type Product = {
    id: string
    title: string
    brand: string
    image_url: string
    price: number
    goal_likes: number
    status: "En vote" | "En précommande" | "Rupture"
}

export default function VotesPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) =>
            setUser(session?.user ?? null),
        )
        fetchProducts()

        return () => {
            authListener?.subscription.unsubscribe()
        }
    }, [])

    async function fetchProducts() {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false })
        if (!error && data) setProducts(data as Product[])
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            {/* Hero Section */}
            <section className="py-16 px-4 text-center border-b border-border">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Votez pour vos <span className="italic">sneakers</span> préférées
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Choisissez jusqu’à 2 paires maximum et suivez leur progression vers la précommande.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Communauté active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            <span>2 votes maximum</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Production sur quota</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leaderboard */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-12">
                        <Trophy className="w-8 h-8" />
                        <h2 className="text-3xl font-bold">Classement des votes</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {products.slice(0, 3).map((p) => (
                            <VoteCard key={p.id} product={p} user={user} />
                        ))}
                    </div>
                </div>
            </section>

            {/* All products */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12">Toutes les sneakers</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((p) => (
                            <VoteCard key={p.id} product={p} user={user} small />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA vers les précommandes */}
            <div className="mt-10 flex justify-center">
                <Link href="/precommandes">
                    <Button className="bg-black text-white hover:bg-white hover:text-black border border-black px-6 py-3 text-lg">
                        Voir les précommandes disponibles
                    </Button>
                </Link>
            </div>
            <br />
            <br />
            <br />
            <Footer />
        </div>
    )
}

/* -------------------- Card de vote -------------------- */

function VoteCard({ product, user, small }: { product: Product; user: User | null; small?: boolean }) {
    const router = useRouter()
    const [votesCount, setVotesCount] = useState(0)
    const [userVoted, setUserVoted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showUnvoteConfirm, setShowUnvoteConfirm] = useState(false)

    const fetchVotes = useCallback(async () => {
        const { count } = await supabase
            .from("votes")
            .select("*", { count: "exact", head: true })
            .eq("product_id", product.id)
            .gte("created_at", getVoteWindowStart())
        setVotesCount(count || 0)
    }, [product.id])

    const checkUserVote = useCallback(async () => {
        const { data } = await supabase
            .from("votes")
            .select("product_id")
            .eq("user_id", user?.id)
            .eq("product_id", product.id)
            .gte("created_at", getVoteWindowStart())
        setUserVoted(!!(data && data.length))
    }, [product.id, user?.id])

    useEffect(() => {
        fetchVotes()
        if (user) checkUserVote()
    }, [fetchVotes, checkUserVote, user])

    async function handleVote(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        event.stopPropagation()
        if (!user) {
            toast.info("Connecte-toi pour voter !")
            return
        }

        if (userVoted) {
            setShowUnvoteConfirm(true)
            return
        }

        setLoading(true)
        const result = await createVote(product.id)
        setLoading(false)

        if (!result.ok) {
            if (result.status === 401) {
                toast.info("Connecte-toi pour voter !")
            } else if (result.status === 409) {
                toast.info(result.message ?? "Tu as déjà voté pour cette paire ce mois-ci !")
            } else {
                toast.error(result.message ?? "Erreur lors du vote, réessaie.")
            }
            return
        }

        toast.success(result.message ?? "Ton vote a bien été pris en compte !")
        setUserVoted(true)
        if (typeof result.votes === "number") {
            setVotesCount(result.votes)
        } else {
            fetchVotes()
        }
    }

    async function handleUnvote(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        event.stopPropagation()

        if (!user) return

        setLoading(true)
        const result = await removeVote(product.id)
        setLoading(false)
        setShowUnvoteConfirm(false)

        if (!result.ok) {
            if (result.status === 401) {
                toast.info("Connecte-toi pour gérer tes likes.")
            } else if (result.status === 404) {
                toast.info(result.message ?? "Aucun like récent à retirer.")
            } else {
                toast.error(result.message ?? "Impossible de retirer ton like, réessaie.")
            }
            return
        }

        toast.success(result.message ?? "Ton like a bien été retiré.")
        setUserVoted(false)
        if (typeof result.votes === "number") {
            setVotesCount(result.votes)
        } else {
            fetchVotes()
        }
    }

    const percent = Math.min(100, (votesCount / (product.goal_likes || 1)) * 100)

    function handleCardActivate() {
        router.push(`/products/${product.id}`)
    }

    function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === "Enter" || event.key === " " || event.key === "Space") {
            event.preventDefault()
            handleCardActivate()
        }
    }

    return (
        <div
            role="link"
            tabIndex={0}
            onClick={handleCardActivate}
            onKeyDown={handleCardKeyDown}
            className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7CFF6B]"
        >
            <Card className="border border-black/20 hover:border-black transition-all duration-300 bg-white">
                <CardHeader className="pb-2">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
                        <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {/* Ligne nom du produit + bouton like */}
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold truncate">{product.title}</CardTitle>
                        <Button
                            variant={userVoted ? "default" : "outline"}
                            disabled={loading}
                            onClick={handleVote}
                            size={small ? "sm" : "icon"}
                            aria-label={userVoted ? "Retirer mon like" : "Voter"}
                            aria-pressed={userVoted}
                        >
                            <Heart className="w-5 h-5" fill={userVoted ? "#000000" : "none"} />
                        </Button>
                    </div>

                    {/* Progress bar uniquement */}
                    <div>
                        <div className="flex justify-between text-xs text-neutral-500 mb-1">
                            <span>{votesCount} votes</span>
                            <span>{Math.round(percent)}%</span>
                        </div>
                        <Progress value={percent} className="h-2 rounded-full" />
                    </div>
                </CardContent>
            </Card>
            <ConfirmDialog
                open={showUnvoteConfirm}
                onOpenChange={setShowUnvoteConfirm}
                title="Retirer ton like ?"
                description="Ce produit quittera ta sélection du mois, mais tu pourras voter à nouveau."
                confirmLabel="Retirer"
                onConfirm={handleUnvote}
                confirmLoading={loading}
            />
        </div>
    )
}
