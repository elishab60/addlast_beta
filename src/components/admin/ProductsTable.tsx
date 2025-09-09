"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import ProductEditModal from "./ProductEditModal";
import ProductCreateModal from "./ProductCreateModal";
import { toast } from "sonner";

type Product = {
    id: string;
    title: string;
    brand: string;
    model: string;
    price: number | null;
    sizes: string[] | null;
    colors: string[] | null;
    stock: number | null;
    goal_likes: number | null;
    images: string[] | null;
    created_at?: string | null;
};

export default function ProductsTable() {
    const [products, setProducts] = useState<Product[]>([]);
    const [editing, setEditing] = useState<Product | null>(null);
    const [showCreate, setShowCreate] = useState<boolean>(false);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            setProducts([]);
            return;
        }
        setProducts(data ?? []);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce produit ?")) return;
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (!error) {
            toast.success("Produit supprimé");
            fetchProducts();
        }
    };

    return (
        <div className="w-full bg-white rounded-xl shadow p-6">
            {/* Bouton d'ajout */}
            <div className="flex justify-end mb-4">
                <Button size="sm" onClick={() => setShowCreate(true)}>
                    + Ajouter un produit
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                            Image
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                            Titre
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                            Marque
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                            Modèle
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                            Prix
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                            Tailles
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                            Couleurs
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                            Stock
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                            Objectif Likes
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition">
                            <td className="px-3 py-2">
                                {product.images?.[0] && (
                                    <img
                                        src={product.images[0]}
                                        className="w-10 h-10 object-contain rounded"
                                        alt={product.title}
                                    />
                                )}
                            </td>
                            <td className="px-3 py-2 font-semibold break-all truncate max-w-[120px]">
                                {product.title}
                            </td>
                            <td className="px-3 py-2 break-all truncate max-w-[90px]">
                                {product.brand}
                            </td>
                            <td className="px-3 py-2 break-all truncate max-w-[90px]">
                                {product.model}
                            </td>
                            <td className="px-3 py-2">{product.price ?? 0} €</td>
                            <td className="px-3 py-2 break-all truncate max-w-[90px]">
                                {Array.isArray(product.sizes) ? product.sizes.join(", ") : ""}
                            </td>
                            <td className="px-3 py-2 break-all truncate max-w-[90px]">
                                {Array.isArray(product.colors) ? product.colors.join(", ") : ""}
                            </td>
                            <td className="px-3 py-2">{product.stock ?? 0}</td>
                            <td className="px-3 py-2">{product.goal_likes ?? 100}</td>
                            <td className="px-3 py-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditing(product)}
                                >
                                    Modifier
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    Supprimer
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {editing && (
                <ProductEditModal
                    product={editing}
                    onClose={() => {
                        setEditing(null);
                        fetchProducts();
                    }}
                    onRefresh={fetchProducts}
                />
            )}
            {showCreate && (
                <ProductCreateModal
                    onClose={() => {
                        setShowCreate(false);
                        fetchProducts();
                    }}
                />
            )}
        </div>
    );
}
