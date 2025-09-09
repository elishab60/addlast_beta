"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult,
} from "@hello-pangea/dnd";

type Product = {
    id: string;
    title: string;
    brand: string;
    model: string;
    price: number | null;
    stock: number | null;
    description: string | null;
    sizes: string[] | null;
    colors: string[] | null;
    images: string[] | null;
};

type ProductEditModalProps = {
    product: Product;
    onClose: () => void;
    onRefresh?: () => void;
};

export default function ProductEditModal({
                                             product,
                                             onClose,
                                             onRefresh,
                                         }: ProductEditModalProps) {
    // Champs de base
    const [title, setTitle] = useState<string>(product.title || "");
    const [brand, setBrand] = useState<string>(product.brand || "");
    const [model, setModel] = useState<string>(product.model || "");
    const [price, setPrice] = useState<string>(String(product.price ?? ""));
    const [stock, setStock] = useState<number>(product.stock ?? 0);
    const [description, setDescription] = useState<string>(product.description || "");

    // Tailles dynamiques
    const [sizes, setSizes] = useState<string[]>(product.sizes || []);
    const addSize = () => setSizes((prev) => [...prev, ""]);
    const updateSize = (idx: number, value: string) =>
        setSizes((prev) => prev.map((s, i) => (i === idx ? value : s)));
    const removeSize = (idx: number) =>
        setSizes((prev) => prev.filter((_, i) => i !== idx));

    // Couleurs dynamiques
    const [colors, setColors] = useState<string[]>(product.colors || []);
    const addColor = () => setColors((prev) => [...prev, ""]);
    const updateColor = (idx: number, value: string) =>
        setColors((prev) => prev.map((c, i) => (i === idx ? value : c)));
    const removeColor = (idx: number) =>
        setColors((prev) => prev.filter((_, i) => i !== idx));

    // Images existantes + nouvelles (drag & drop, remove, upload)
    const [images, setImages] = useState<string[]>(product.images || []);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Drag & drop images (string[] + File[])
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = [...images];
        const [removed] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, removed);
        setImages(items);
    };

    // Suppression image (juste de la liste, pas du bucket)
    const handleRemoveImage = (idx: number) =>
        setImages((prev) => prev.filter((_, i) => i !== idx));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Upload les nouveaux fichiers avant update
        if (newImages.length > 0) {
            const urls = await Promise.all(
                newImages.map(async (file) => {
                    const filename = `${Date.now()}_${file.name}`;
                    const { error } = await supabase.storage
                        .from("products")
                        .upload(filename, file, {
                            cacheControl: "3600",
                            upsert: false,
                        });
                    if (error) {
                        toast.error("Erreur d'upload : " + error.message);
                        return null;
                    }
                    const { data: publicUrl } = supabase.storage
                        .from("products")
                        .getPublicUrl(filename);
                    return publicUrl.publicUrl;
                })
            );
            setImages((prev) => [...prev, ...urls.filter(Boolean) as string[]]);
        }

        const { error } = await supabase
            .from("products")
            .update({
                title,
                brand,
                model,
                price: parseFloat(price),
                stock,
                sizes: sizes.filter((s) => s.trim().length > 0),
                colors: colors.filter((c) => c.trim().length > 0),
                image_url: images[0] || "",
                images,
                description,
                updated_at: new Date().toISOString(),
            })
            .eq("id", product.id);

        setLoading(false);
        if (!error) {
            toast.success("Produit modifié !");
            onClose();
            onRefresh?.();
        } else {
            toast.error("Erreur : " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
                <h2 className="font-bold text-lg mb-4">Modifier le produit</h2>

                <div className="mb-4">
                    <Input
                        placeholder="Titre"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        placeholder="Marque"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        placeholder="Modèle"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="number"
                        placeholder="Prix"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        min={0}
                    />
                </div>

                {/* Tailles dynamiques */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Tailles disponibles</label>
                    <div className="space-y-2">
                        {sizes.map((size, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <Input
                                    value={size}
                                    onChange={(e) => updateSize(idx, e.target.value)}
                                    className="w-24"
                                    placeholder="Ex: 38"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    type="button"
                                    onClick={() => removeSize(idx)}
                                    aria-label="Supprimer la taille"
                                >
                                    ×
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addSize}>
                            Ajouter une taille
                        </Button>
                    </div>
                </div>

                {/* Couleurs dynamiques */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Couleurs disponibles</label>
                    <div className="space-y-2">
                        {colors.map((color, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <Input
                                    value={color}
                                    onChange={(e) => updateColor(idx, e.target.value)}
                                    className="w-24"
                                    placeholder="Ex: Noir"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    type="button"
                                    onClick={() => removeColor(idx)}
                                    aria-label="Supprimer la couleur"
                                >
                                    ×
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addColor}>
                            Ajouter une couleur
                        </Button>
                    </div>
                </div>

                <div className="mb-4">
                    <Input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Upload et drag d'images */}
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">
                        Images du produit (glisser pour réordonner, cliquer pour retirer)
                    </label>
                    <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setNewImages(e.target.files ? Array.from(e.target.files) : [])}
                    />
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="images" direction="horizontal">
                            {(provided) => (
                                <div
                                    className="flex mt-2 gap-2"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {images.map((img, idx) => (
                                        <Draggable key={img + idx} draggableId={img + idx} index={idx}>
                                            {(provided2) => (
                                                <div
                                                    ref={provided2.innerRef}
                                                    {...provided2.draggableProps}
                                                    {...provided2.dragHandleProps}
                                                    className="w-16 h-16 rounded border flex items-center justify-center overflow-hidden bg-gray-100 cursor-pointer relative group"
                                                    onClick={() => handleRemoveImage(idx)}
                                                    title="Supprimer cette image"
                                                >
                                                    <img
                                                        src={img}
                                                        className="object-contain w-full h-full"
                                                        alt={`Image ${idx + 1}`}
                                                    />
                                                    <span className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white font-bold text-lg">
                            ×
                          </span>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                <div className="flex gap-2 mt-8">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                    <Button variant="outline" type="button" onClick={onClose}>
                        Annuler
                    </Button>
                </div>
            </form>
        </div>
    );
}
