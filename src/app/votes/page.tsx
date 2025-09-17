"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Trophy, Users, Clock } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Product = {
    id: string
    name: string
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
        fetchProducts()
    }, [])

    async function fetchProducts() {
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })
        if (!error && data) setProducts(data as Product[])
    }

    return (

        <div className="min-h-screen bg-background">
            <Header/>
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
                            <Users className="w-4 h-4"/>
                            <span>Communauté active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4"/>
                            <span>2 votes maximum</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4"/>
                            <span>Production sur quota</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leaderboard */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-12">
                        <Trophy className="w-8 h-8"/>
                        <h2 className="text-3xl font-bold">Classement des votes</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {products.slice(0, 3).map((p) => (
                            <VoteCard key={p.id} product={p} user={user}/>
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
                            <VoteCard key={p.id} product={p} user={user} small/>
                        ))}
                    </div>
                </div>
            </section>
            {/* CTA vers les précommandes */}
            <div className="mt-10 flex justify-center">
                <Link href="/precommandes">
                    <Button
                        className="bg-black text-white hover:bg-white hover:text-black border border-black px-6 py-3 text-lg">
                        Voir les précommandes disponibles
                    </Button>
                </Link>
            </div>
            <br/>
            <br/>
            <br/>
            <Footer/>
        </div>
    )
}

/* -------------------- Card de vote -------------------- */

function VoteCard({ product, user, small }: { product: Product; user: User | null; small?: boolean }) {
    const [votesCount, setVotesCount] = useState(0)
    const [userVoted, setUserVoted] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchVotes()
        if (user) checkUserVote()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, product.id])

    async function fetchVotes() {
        const { count } = await supabase
            .from("votes")
            .select("*", { count: "exact", head: true })
            .eq("product_id", product.id)
            .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString())
        setVotesCount(count || 0)
    }

    async function checkUserVote() {
        const { data } = await supabase
            .from("votes")
            .select("product_id")
            .eq("user_id", user?.id)
            .eq("product_id", product.id)
            .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString())
        setUserVoted(!!(data && data.length))
    }

    async function handleVote(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        if (!user) {
            toast.info("Connecte-toi pour voter !")
            return
        }

        setLoading(true)
        const { data: userVotes } = await supabase
            .from("votes")
            .select("product_id")
            .eq("user_id", user.id)
            .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString())

        if (userVotes?.some((v: { product_id: string }) => v.product_id === product.id)) {
            toast.info("Tu as déjà voté pour cette paire ce mois-ci !")
            setLoading(false)
            return
        }

        if ((userVotes?.length || 0) >= 2) {
            toast.error("Tu as atteint la limite de 2 votes ce mois-ci.")
            setLoading(false)
            return
        }

        const { error } = await supabase.from("votes").insert({ user_id: user.id, product_id: product.id })
        setLoading(false)

        if (!error) {
            toast.success("Ton vote a bien été pris en compte !")
            setUserVoted(true)
            fetchVotes()
        } else {
            toast.error("Erreur lors du vote, réessaie.")
        }
    }

    const percent = Math.min(100, (votesCount / (product.goal_likes || 1)) * 100)

    return (
        <Link href={`/products/${product.id}`} className="block group">
            <Card className="border border-black/20 hover:border-black transition-all duration-300 bg-white">
                <CardHeader className="pb-2">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
                        <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <CardTitle className="mt-3 text-lg font-semibold truncate">{product.name}</CardTitle>
                    <div className="text-sm text-neutral-500">{product.brand}</div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-700">
                            Objectif <span className="font-semibold">{product.goal_likes}</span> likes
                        </span>
                        <Button
                            variant={userVoted ? "default" : "outline"}
                            disabled={userVoted || loading}
                            onClick={handleVote}
                            size={small ? "sm" : "icon"}
                        >
                            <Heart className="w-5 h-5" fill={userVoted ? "#000000" : "none"} />
                        </Button>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-neutral-500 mb-1">
              <span>
                {votesCount} / {product.goal_likes} likes
              </span>
                            <span>{Math.round(percent)}%</span>
                        </div>
                        <Progress value={percent} className="h-2 rounded-full" />
                    </div>
                </CardContent>
            </Card>
        </Link>

    )
}
