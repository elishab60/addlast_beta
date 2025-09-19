"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import {
    fetchVoteStatus,
    voteForProduct,
    removeVoteForProduct,
} from "@/lib/voteApi"

type Product = {
    id: string
    name: string
    brand: string
    image_url: string
    price: number
    goal_likes: number
    status: "En vote" | "En précommande" | "Rupture"
}

type CatalogGridProps = {
    title?: string
    products: Product[]
    user: User | null
    ctaHref?: string
}

export default function CatalogGrid({
                                        title = "Découvre les modèles",
                                        products,
                                        user,
                                        ctaHref = "/products",
                                    }: CatalogGridProps) {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Titre centré avec underline hover */}
                <div className="text-center mb-10 md:mb-12">
          <span className="relative inline-block group">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-black transition-colors duration-300 group-hover:text-gray-700">
              {title}
            </h2>
            <span className="pointer-events-none absolute left-0 -bottom-2 h-0.5 bg-black w-0 transition-all duration-300 group-hover:w-full"></span>
          </span>
                </div>

                {/* Grille adaptative centrée */}
                <div
                    className="
            grid gap-6 justify-center
            [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]
          "
                >
                    {products.map((p) => (
                        <GridCard key={p.id} product={p} user={user} />
                    ))}
                </div>

                {/* CTA centré sous les cards */}
                <div className="text-center mt-10">
                    <Link href={ctaHref}>
                        <Button className="bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 px-8 py-3 text-base font-medium tracking-wide">
                            Voir tout le catalogue
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

/* -------------------- Card avec logique de vote -------------------- */

function GridCard({ product, user }: { product: Product; user: User | null }) {
    const router = useRouter()
    const [votesCount, setVotesCount] = useState(0)
    const [userVoted, setUserVoted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showUnvoteConfirm, setShowUnvoteConfirm] = useState(false)
    const userId = user?.id

    const refreshVoteStatus = useCallback(async () => {
        try {
            const status = await fetchVoteStatus(product.id)
            setVotesCount(status.votes)
            setUserVoted(userId ? status.userVoted : false)
        } catch (error) {
            console.error("Failed to fetch vote status", error)
        }
    }, [product.id, userId])

    useEffect(() => {
        refreshVoteStatus()
    }, [refreshVoteStatus])

    async function handleVote(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            toast.info("Connecte-toi pour voter !")
            return
        }

        if (userVoted) {
            setShowUnvoteConfirm(true)
            return
        }

        setLoading(true)

        try {
            const result = await voteForProduct(product.id)
            setLoading(false)

            if (!result.ok) {
                if (result.status === 401) {
                    toast.info("Connecte-toi pour voter !")
                } else if (result.status === 409) {
                    const message = result.message || "Tu as déjà voté pour cette paire ce mois-ci !"
                    if (message.toLowerCase().includes("limite")) {
                        setShowModal(true)
                    } else {
                        toast.info(message)
                    }
                } else {
                    toast.error(result.message || "Erreur lors du vote, réessaie.")
                }
                return
            }

            toast.success(result.message || "Ton vote a bien été pris en compte !")
            await refreshVoteStatus()
        } catch (error) {
            setLoading(false)
            console.error("Failed to vote", error)
            toast.error("Erreur lors du vote, réessaie.")
        }
    }

    async function handleUnvote() {
        if (!user) return

        setLoading(true)
        try {
            const result = await removeVoteForProduct(product.id)
            setLoading(false)
            setShowUnvoteConfirm(false)

            if (!result.ok) {
                if (result.status === 401) {
                    toast.info("Connecte-toi pour gérer tes likes.")
                } else if (result.status === 404) {
                    toast.info(result.message || "Aucun like récent à retirer.")
                } else {
                    toast.error(result.message || "Impossible de retirer ton like, réessaie.")
                }
                return
            }

            toast.success(result.message || "Ton like a bien été retiré.")
            await refreshVoteStatus()
        } catch (error) {
            setLoading(false)
            setShowUnvoteConfirm(false)
            console.error("Failed to remove vote", error)
            toast.error("Impossible de retirer ton like, réessaie.")
        }
    }

    const percent = Math.min(
        100,
        (votesCount / (product.goal_likes > 0 ? product.goal_likes : 1)) * 100
    )

    function handleCardActivate() {
        router.push(`/products/${product.id}`)
    }

    function handleCardKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === "Enter" || event.key === " " || event.key === "Space") {
            event.preventDefault()
            handleCardActivate()
        }
    }

    return (
        <Card
            role="link"
            tabIndex={0}
            onClick={handleCardActivate}
            onKeyDown={handleCardKeyDown}
            className="group cursor-pointer border border-black/20 hover:border-black transition-all duration-300 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7CFF6B]"
        >
            <CardHeader className="pb-2">
                {/* Image carrée */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
                    <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <CardTitle className="mt-3 text-lg font-semibold truncate text-black">
                    {product.name}
                </CardTitle>
                <div className="text-sm text-neutral-500">{product.brand}</div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-xl text-black">{product.price}€</span>

                    {/* Bouton like — shadcn monochrome */}
                    <Button
                        variant={userVoted ? "default" : "outline"}
                        disabled={loading}
                        onClick={handleVote}
                        size="icon"
                        className={
                            userVoted
                                ? "rounded-full w-12 h-12 bg-black text-white border-2 border-black hover:bg-white hover:text-black"
                                : "rounded-full w-12 h-12 border-2 border-black text-black hover:bg-black hover:text-white"
                        }
                        aria-label={userVoted ? "Retirer mon like" : "Voter"}
                        aria-pressed={userVoted}
                    >
                        <Heart className="w-6 h-6 transition-all" fill={userVoted ? "#000000" : "none"} />
                    </Button>
                </div>

                {/* Progress likes */}
                <div>
                    <div className="flex justify-between text-xs text-neutral-500 mb-1">
            <span>
              {votesCount} / {product.goal_likes} likes
            </span>
                        <span>{Math.round(percent)}%</span>
                    </div>
                    <Progress value={percent} className="h-2 rounded-full" />
                </div>

                {/* Bandeau d'état sous la progressbar */}
                <StatusBand
                    status={product.status}
                    votesCount={votesCount}
                    goal_likes={product.goal_likes}
                />
            </CardContent>

            {/* Modal limite de votes */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Limite de votes atteinte</DialogTitle>
                    </DialogHeader>
                    <div className="py-2 text-sm">
                        <p>
                            Tu as déjà voté pour 2 paires différentes ce mois-ci.
                            <br />
                            Retente le mois prochain ou retire un vote depuis ton profil.
                        </p>
                    </div>
                    <Button onClick={() => setShowModal(false)} className="mt-2 w-full">
                        Fermer
                    </Button>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={showUnvoteConfirm}
                onOpenChange={setShowUnvoteConfirm}
                title="Retirer ton like ?"
                description="Cela libère un vote que tu pourras utiliser sur une autre paire."
                confirmLabel="Retirer"
                onConfirm={handleUnvote}
                confirmLoading={loading}
            />
        </Card>
    )
}

/* -------------------- Bandeau d'état (sous la progressbar) -------------------- */

function StatusBand({
                        status,
                        votesCount,
                        goal_likes,
                    }: {
    status: Product["status"]
    votesCount: number
    goal_likes: number
}) {
    const base =
        "w-full text-center text-xs font-medium tracking-wider uppercase rounded-md py-2 border"

    // Détermine si quota atteint
    const quotaAtteint = votesCount >= (goal_likes || 1)

    if (quotaAtteint) {
        return <div className={`${base} bg-white text-black border-black`}>En précommande</div>
    }
    if (status === "En vote") {
        return <div className={`${base} bg-black text-white border-black`}>En vote</div>
    }
    return (
        <div className={`${base} bg-neutral-100 text-neutral-600 border-neutral-300`}>
            Rupture
        </div>
    )
}
