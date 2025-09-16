"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, ShieldCheck, Users } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

type Product = {
    id: string
    title: string
    name: string
    brand: string
    image_url: string
    price: number
    goal_likes: number
    status: "En vote" | "En précommande" | "Rupture"
}

export default function PrecommandesPage() {
    const [products, setProducts] = useState<(Product & { votes: number; reachedQuota: boolean })[]>([])

    useEffect(() => {
        fetchProducts()
    }, [])

    async function fetchProducts() {
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

        if (error || !data) {
            console.error("Erreur récupération produits:", error)
            setProducts([])
            return
        }

        const productsWithVotes = await Promise.all(
            data.map(async (p: Product) => {
                const { count } = await supabase
                    .from("votes")
                    .select("*", { count: "exact", head: true })
                    .eq("product_id", p.id)

                const votes = count || 0
                const reachedQuota = votes >= (p.goal_likes || 1)
                return { ...p, votes, reachedQuota }
            })
        )

        setProducts(productsWithVotes.filter((p) => p.reachedQuota))
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero */}
            <section className="py-20 px-4 text-center border-b border-border bg-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Campagnes de <span className="italic">précommande</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Soutenez la réédition de modèles rares. Payez un acompte sécurisé pour garantir votre paire.
                        Livraison prévue une fois la production terminée.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Ouvert uniquement aux modèles ayant atteint le quota</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Acompte et droit de rétractation 14 jours</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section campagnes */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-lg text-muted-foreground mb-6">
                                Actuellement, aucune paire n’a encore atteint le quota nécessaire pour passer en précommande.
                            </p>
                            <Link href="/votes">
                                <Button className="bg-black text-white hover:bg-white hover:text-black border border-black">
                                    Aller voter pour changer ça
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold mb-12">Sneakers en cours de précommande</h2>
                            <div
                                className={`
                  grid gap-6
                  ${products.length === 1 ? "grid-cols-1 max-w-md mx-auto" : ""}
                  ${products.length === 2 ? "grid-cols-1 sm:grid-cols-2" : ""}
                  ${products.length === 3 ? "grid-cols-1 sm:grid-cols-3" : ""}
                  ${products.length >= 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : ""}
                `}
                            >
                                {products.map((p) => (
                                    <PrecommandeCard key={p.id} product={p} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    )
}

function PrecommandeCard({ product }: { product: Product }) {
    return (
        <Link href={`/products/${product.id}`} className="block group">
            <Card className="border border-black/20 hover:border-black transition-all duration-300 bg-white h-full">
                <CardHeader className="pb-2">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
                        <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.title || product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <CardTitle className="mt-3 text-lg font-semibold truncate">
                        {product.title || product.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-xl">{product.price}€</span>
                        <Button size="sm" className="bg-black text-white hover:bg-white hover:text-black border border-black">
                            <ShoppingCart className="w-4 h-4 mr-2" /> Précommander
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
