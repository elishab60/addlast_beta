"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ProductCarousel } from "@/components/ProductCarousel"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/context/CartContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { getVoteWindowStart } from "@/lib/voteWindow"
import type { User } from "@supabase/supabase-js"

type Product = {
    id: string
    title: string
    brand: string
    price: number
    images: string[]
    description: string
    sizes: string[]
    goal_likes: number
    status: "En vote" | "En précommande" | "Rupture"
}

export default function ProductPage() {
    const params = useParams()
    const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined)

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [votesCount, setVotesCount] = useState(0)
    const [user, setUser] = useState<User | null>(null)
    const [userVoted, setUserVoted] = useState(false)
    const [userShoeSize, setUserShoeSize] = useState<string>("")
    const [dirty, setDirty] = useState(false)
    const [showGuide, setShowGuide] = useState(false)
    const [showUnvoteConfirm, setShowUnvoteConfirm] = useState(false)
    const [voteLoading, setVoteLoading] = useState(false)
    const { addToCart } = useCart()

    useEffect(() => {
        if (!id) return
            ;(async () => {
            setLoading(true)

            // Produit
            const { data: prod } = await supabase.from("products").select("*").eq("id", id).single()
            if (prod) setProduct(prod as Product)

            // User
            const { data: auth } = await supabase.auth.getUser()
            const currentUser = auth?.user ?? null
            setUser(currentUser)

            // Profil avec pointure
            if (currentUser) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("pointure")
                    .eq("id", currentUser.id)
                    .single()

                if (profile?.pointure) {
                    setUserShoeSize(profile.pointure)
                }
            }

            setLoading(false)
        })()
    }, [id])

    const fetchVotes = useCallback(async () => {
        if (!product) return
        const { count } = await supabase
            .from("votes")
            .select("*", { count: "exact", head: true })
            .eq("product_id", product.id)
            .gte("created_at", getVoteWindowStart())
        setVotesCount(count || 0)
    }, [product])

    const checkUserVote = useCallback(async () => {
        if (!user || !product) return
        const { data } = await supabase
            .from("votes")
            .select("product_id")
            .eq("user_id", user.id)
            .eq("product_id", product.id)
            .gte("created_at", getVoteWindowStart())
        setUserVoted(!!(data && data.length))
    }, [product, user])

    useEffect(() => {
        if (!product) return
        fetchVotes()
        if (user) checkUserVote()
    }, [product, user, fetchVotes, checkUserVote])

    async function handleVote() {
        if (!user) {
            toast.info("Connecte-toi pour voter !")
            return
        }
        if (userVoted) {
            setShowUnvoteConfirm(true)
            return
        }

        setVoteLoading(true)
        try {
            const response = await fetch("/api/votes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product?.id }),
            })

            const payload = await response.json()

            if (!response.ok) {
                const errorMessage = payload?.message || "Erreur lors du vote"
                if (response.status === 401) {
                    toast.info("Connecte-toi pour voter !")
                } else {
                    toast.error(errorMessage)
                }
                setVoteLoading(false)
                return
            }

            toast.success(payload?.message ?? "Vote enregistré ✅")
            setUserVoted(true)
            setVotesCount(payload?.votes ?? votesCount + 1)
            setVoteLoading(false)
        } catch {
            setVoteLoading(false)
            toast.error("Erreur lors du vote")
        }
    }

    async function handleUnvote() {
        if (!user || !product) return

        setVoteLoading(true)
        try {
            const response = await fetch("/api/votes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
            })

            const payload = await response.json()

            if (!response.ok) {
                const message = payload?.message || "Impossible de retirer ton like."
                if (response.status === 404) {
                    toast.info(message)
                } else if (response.status === 401) {
                    toast.info("Connecte-toi pour gérer tes likes.")
                } else {
                    toast.error(message)
                }
                setVoteLoading(false)
                setShowUnvoteConfirm(false)
                return
            }

            toast.success(payload?.message ?? "Ton like a bien été retiré.")
            setUserVoted(false)
            setVotesCount(payload?.votes ?? Math.max(0, votesCount - 1))
            setVoteLoading(false)
            setShowUnvoteConfirm(false)
        } catch {
            setVoteLoading(false)
            setShowUnvoteConfirm(false)
            toast.error("Impossible de retirer ton like, réessaie.")
        }
    }

    async function handleSaveSize() {
        if (!user) return
        const { error } = await supabase
            .from("profiles")
            .update({ pointure: userShoeSize })
            .eq("id", user.id)

        if (!error) {
            toast.success("Pointure mise à jour ✅")
            setDirty(false)
        } else {
            toast.error("Erreur lors de la mise à jour")
        }
    }

    const handlePreorder = () => {
        if (!userShoeSize) {
            toast.info("Merci de choisir une taille !")
            return
        }
        if (!product) return

        addToCart({
            productId: product.id,
            name: product.title,
            image: product.images[0],
            size: userShoeSize,
            price: product.price,
            quantity: 1,
        })
        toast.success("Précommande ajoutée au panier ✅")
    }

    if (loading || !product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">Chargement…</main>
                <Footer />
            </div>
        )
    }

    const percent = Math.min(100, (votesCount / (product.goal_likes || 1)) * 100)
    const shoeSizes = Array.from({ length: 40 }, (_, i) => (35 + i * 0.5).toString())

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="container mx-auto flex-1 flex flex-col md:flex-row gap-12 py-12">
                {/* Images */}
                <div className="flex-1 min-w-[320px] max-w-lg">
                    <ProductCarousel images={product.images} productName={product.title} />
                </div>

                {/* Détails */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Bandeau état */}
                    <div
                        className={`w-full text-center text-xs font-medium uppercase rounded-md py-2 border ${
                            percent >= 100
                                ? "bg-white text-black border-black"
                                : product.status === "En vote"
                                    ? "bg-black text-white border-black"
                                    : "bg-neutral-200 text-neutral-600 border-neutral-300"
                        }`}
                    >
                        {percent >= 100 ? "En précommande" : product.status}
                    </div>

                    {/* Infos produit */}
                    <div>
                        <h1 className="text-3xl font-bold">{product.title}</h1>
                        <div className="text-lg text-muted-foreground">{product.brand}</div>
                        <div className="text-2xl font-semibold mt-2">{product.price} €</div>
                    </div>

                    {/* Progress votes */}
                    <div>
                        <div className="flex justify-between text-xs text-neutral-500 mb-1">
              <span>
                {votesCount} / {product.goal_likes} likes
              </span>
                            <span>{Math.round(percent)}%</span>
                        </div>
                        <Progress value={percent} className="h-2 rounded-full" />
                    </div>

                    {/* Bouton vote */}
                    {product.status === "En vote" && percent < 100 && (
                        <Button
                            variant={userVoted ? "default" : "outline"}
                            disabled={voteLoading}
                            onClick={handleVote}
                            className="w-full"
                            aria-label={userVoted ? "Retirer mon like" : "Voter pour cette paire"}
                            aria-pressed={userVoted}
                        >
                            <Heart className="w-5 h-5 mr-2" fill={userVoted ? "#000000" : "none"} />
                            {userVoted ? "Retirer mon like" : "Voter pour cette paire"}
                        </Button>
                    )}

                    {/* Précommande si quota atteint */}
                    {percent >= 100 && (
                        <>
                            <div>
                                <div className="mb-2 font-medium flex items-center justify-between">
                                    <span>Votre taille</span>
                                    <Button variant="outline" size="sm" onClick={() => setShowGuide(true)}>
                                        Guide des tailles
                                    </Button>
                                </div>

                                <Select
                                    value={userShoeSize}
                                    onValueChange={(value) => {
                                        setUserShoeSize(value)
                                        setDirty(true)
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir une pointure" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shoeSizes.map((size) => (
                                            <SelectItem key={size} value={size}>
                                                {size} EU
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {dirty && (
                                    <Button onClick={handleSaveSize} className="mt-3 w-full">
                                        Enregistrer la taille
                                    </Button>
                                )}
                            </div>

                            <Button
                                size="lg"
                                className="mt-4 w-full text-lg"
                                onClick={handlePreorder}
                                disabled={!userShoeSize}
                            >
                                Précommander
                            </Button>
                        </>
                    )}

                    {/* Description */}
                    <div className="mt-4 text-base text-gray-700 leading-relaxed whitespace-pre-line">
                        {product.description}
                    </div>
                </div>
            </main>
            <Footer />

            <ConfirmDialog
                open={showUnvoteConfirm}
                onOpenChange={setShowUnvoteConfirm}
                title="Retirer ton like ?"
                description="Ce vote sera libéré et tu pourras le réutiliser sur une autre paire."
                confirmLabel="Retirer"
                onConfirm={handleUnvote}
                confirmLoading={voteLoading}
            />

            {/* Guide des tailles */}
            <Dialog open={showGuide} onOpenChange={setShowGuide}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Guide des tailles</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-gray-300">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2">EU</th>
                                <th className="border px-4 py-2">US Homme</th>
                                <th className="border px-4 py-2">US Femme</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="border px-4 py-2">40</td>
                                <td className="border px-4 py-2">7</td>
                                <td className="border px-4 py-2">8.5</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">41</td>
                                <td className="border px-4 py-2">8</td>
                                <td className="border px-4 py-2">9.5</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">42</td>
                                <td className="border px-4 py-2">9</td>
                                <td className="border px-4 py-2">10.5</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">43</td>
                                <td className="border px-4 py-2">10</td>
                                <td className="border px-4 py-2">11.5</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">44</td>
                                <td className="border px-4 py-2">11</td>
                                <td className="border px-4 py-2">12.5</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
