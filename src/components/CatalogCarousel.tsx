"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { getVoteWindowStart } from "@/lib/voteWindow"
import { ConfirmDialog } from "@/components/ConfirmDialog"

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
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black text-balance transition-colors duration-300 group-hover:text-accent-muted">
                            {title}
                        </h2>
                        <span className="pointer-events-none absolute left-0 -bottom-2 h-0.5 bg-accent w-0 transition-all duration-300 group-hover:w-full"></span>
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
                        <Button className="bg-black text-white  transition-all duration-300 hover:bg-accent hover:text-black px-8 py-3 text-base font-medium tracking-wide">
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
            .gte("created_at", getVoteWindowStart())
        setVotesCount(count || 0)
    }

    async function checkUserVote() {
        const { data } = await supabase
            .from("votes")
            .select("product_id")
            .eq("user_id", user?.id)
            .eq("product_id", product.id)
            .gte("created_at", getVoteWindowStart())
        setUserVoted(!!(data && data.length))
    }

    async function handleVote(e: React.MouseEvent<HTMLButtonElement>) {
        // Empêche la redirection de la card
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

        const { data: userVotes } = await supabase
            .from("votes")
            .select("product_id")
            .eq("user_id", user.id)
            .gte("created_at", getVoteWindowStart())

        if (userVotes?.some((v: { product_id: string }) => v.product_id === product.id)) {
            toast.info("Tu as déjà voté pour cette paire ce mois-ci !")
            setLoading(false)
            return
        }

        if ((userVotes?.length || 0) >= 2) {
            setShowModal(true)
            setLoading(false)
            return
        }

        const { error } = await supabase.from("votes").insert({
            user_id: user.id,
            product_id: product.id,
        })

        setLoading(false)

        if (!error) {
            toast.success("Ton vote a bien été pris en compte !")
            setUserVoted(true)
            fetchVotes()
        } else {
            toast.error("Erreur lors du vote, réessaie.")
        }
    }

    async function handleUnvote(e?: React.MouseEvent) {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }

        if (!user) return

        setLoading(true)
        const { data, error } = await supabase
            .from("votes")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", product.id)
            .gte("created_at", getVoteWindowStart())
            .select("id")

        setLoading(false)
        setShowUnvoteConfirm(false)

        if (error) {
            toast.error("Impossible de retirer ton like, réessaie.")
            return
        }

        if (!data || data.length === 0) {
            toast.info("Aucun like récent à retirer.")
            return
        }

        toast.success("Ton like a bien été retiré.")
        setUserVoted(false)
        fetchVotes()
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
            className="group cursor-pointer border border-border hover:border-accent transition-all duration-300 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
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

                <CardTitle className="mt-3 text-lg font-semibold truncate text-accent group-hover:text-accent-muted transition-colors">
                    {product.name}
                </CardTitle>
                <div className="text-sm text-neutral-500">{product.brand}</div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-xl text-accent">{product.price}€</span>

                    {/* Bouton like */}
                    <Button
                        variant={userVoted ? "default" : "outline"}
                        disabled={loading}
                        onClick={handleVote}
                        size="icon"
                        className={
                            userVoted
                                ? "rounded-full w-12 h-12 bg-accent text-black border-2 border-accent hover:bg-accent"
                                : "rounded-full w-12 h-12 border-2 border-accent text-accent hover:bg-accent hover:text-black"
                        }
                        aria-label={userVoted ? "Retirer mon like" : "Voter"}
                        aria-pressed={userVoted}
                    >
                        <Heart className="w-6 h-6 transition-all" fill={userVoted ? "#7CFF6B" : "none"} color="#7CFF6B" />
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

                {/* Bandeau d'état */}
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
                    <Button onClick={() => setShowModal(false)} className="mt-2 w-full bg-black text-white border border-accent hover:bg-accent hover:text-black">
                        Fermer
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Confirmation retrait vote */}
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

/* -------------------- Bandeau d'état -------------------- */

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

    const quotaAtteint = votesCount >= (goal_likes || 1)

    if (quotaAtteint) {
        return <div className={`${base} bg-white text-accent border-accent`}>En précommande</div>
    }
    if (status === "En vote") {
        return <div className={`${base} bg-accent text-black border-accent`}>En vote</div>
    }
    return (
        <div className={`${base} bg-neutral-100 text-neutral-600 border-neutral-300`}>
            Rupture
        </div>
    )
}
