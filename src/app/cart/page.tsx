"use client";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CartPage() {
    const { items, count } = useCart();

    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

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
                        {items.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl px-5 py-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded" />
                                <div className="flex-1">
                                    <div className="font-bold text-lg">{item.name}</div>
                                    <div className="text-gray-600 text-sm">{item.size && `Taille : ${item.size}`}</div>
                                    <div className="font-semibold mt-2">{item.price} € x {item.quantity}</div>
                                </div>
                                {/* Si tu veux : bouton de suppression ou modification de quantité ici */}
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
