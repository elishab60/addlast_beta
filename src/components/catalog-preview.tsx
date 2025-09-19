"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Product = {
    id: string
    name: string
    image_url: string
    status: "En vote" | "En précommande" | "Rupture"
}

type CatalogPreviewProps = {
    products: Product[]
}

export default function CatalogPreview({ products }: CatalogPreviewProps) {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                {/* Titre centré */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-light tracking-wide text-black">Découvre les modèles</h2>
                </div>

                {/* Grille responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {products.slice(0, 3).map((product) => (
                        <Card
                            key={product.id}
                            className="group border border-black/10 hover:border-accent transition-all duration-300 hover:shadow-lg bg-white"
                        >
                            <CardContent className="p-0">
                                {/* Image */}
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={product.image_url || "/placeholder.svg"}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Contenu */}
                                <div className="p-6 space-y-3">
                                    {/* Nom du modèle */}
                                    <h3 className="text-lg font-medium text-black tracking-wide transition-colors group-hover:text-accent">{product.name}</h3>

                                    {/* Badge d'état */}
                                    <div className="flex justify-start">
                    <span
                        className={`
                      inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase
                      ${
                            product.status === "En vote"
                                ? "bg-black text-white border border-black"
                                : product.status === "En précommande"
                                    ? "bg-white text-black border border-black"
                                    : "bg-gray-100 text-gray-600 border border-gray-300"
                        }
                    `}
                    >
                      {product.status}
                    </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* CTA centré */}
                <div className="text-center">
                    <Link href="/products">
                        <Button className="px-8 py-3 text-base font-medium tracking-wide">
                            Voir tout le catalogue
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
