"use client";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
    const { items, count, total, removeFromCart, updateQuantity, clearCart } = useCart();

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
                <h1 className="text-2xl font-bold mb-8">Mon panier</h1>
                {count === 0 ? (
                    <div className="text-gray-600 text-center mt-16">
                        Ton panier est vide.
                        <div className="mt-6">
                            <Link href="/products">
                                <Button className="rounded-full px-8 py-3 font-bold">Voir le catalogue</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Mon panier ({count})</h2>
                            <Button variant="ghost" onClick={clearCart} className="text-sm">
                                Vider le panier
                            </Button>
                        </div>
                        {items.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl px-5 py-4">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 object-contain rounded"
                                    unoptimized
                                />
                                <div className="flex-1">
                                    <div className="font-bold text-lg">{item.name}</div>
                                    <div className="text-gray-600 text-sm">{item.size && `Taille : ${item.size}`}</div>
                                    <div className="font-semibold mt-2">{item.price} € x {item.quantity}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                                        aria-label="Diminuer la quantité"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                        aria-label="Augmenter la quantité"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFromCart(item.productId, item.size)}
                                    aria-label="Retirer l'article"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        ))}
                        <div className="flex justify-between items-center border-t pt-6 mt-6">
                            <div className="text-xl font-bold">Total</div>
                            <div className="text-xl font-bold">{total} €</div>
                        </div>
                        <Button className="w-full rounded-full py-4 text-lg font-bold">
                            Passer la précommande
                        </Button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
