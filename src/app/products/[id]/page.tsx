"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCarousel from "@/components/ProductCarousel";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

type Product = {
    id: string;
    name: string;
    brand: string;
    price: number;
    images: string[]; // array d’URL
    description: string;
    sizes: string[]; // array de tailles, ex: ["38", "39", "40", "41", "42"]
};

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>("");
    const { addToCart } = useCart();

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            setLoading(true);
            // Supposons que les images et tailles sont stockées en array/text dans Supabase
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single();
            if (!error && data) setProduct(data);
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.info("Merci de choisir une taille !");
            return;
        }
        addToCart({
            productId: product!.id,
            name: product!.name,
            image: product!.images[0],
            size: selectedSize,
            price: product!.price,
            quantity: 1,
        });
        toast.success("L'article a bien été ajouté au panier !");
    };

    if (loading || !product) return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <div>Chargement…</div>
            </main>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="container mx-auto flex-1 flex flex-col md:flex-row gap-12 py-12">
                {/* Images */}
                <div className="flex-1 min-w-[320px] max-w-lg">
                    <ProductCarousel images={product.images} />
                </div>
                {/* Détails */}
                <div className="flex-1 flex flex-col justify-center gap-8">
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <div className="text-lg text-muted-foreground">{product.brand}</div>
                        <div className="text-2xl font-semibold mt-2">{product.price} €</div>
                    </div>
                    {/* Sélection taille */}
                    <div>
                        <div className="mb-2 font-medium">Taille</div>
                        <div className="flex gap-2 flex-wrap">
                            {product.sizes.map((size) => (
                                <Button
                                    key={size}
                                    variant={selectedSize === size ? "default" : "outline"}
                                    className="min-w-[48px]"
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Button
                        size="lg"
                        className="mt-4 w-full text-lg"
                        onClick={handleAddToCart}
                        disabled={!selectedSize}
                    >
                        Ajouter au panier
                    </Button>
                    <div className="mt-4 text-base text-gray-700 leading-relaxed whitespace-pre-line">
                        {product.description}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
