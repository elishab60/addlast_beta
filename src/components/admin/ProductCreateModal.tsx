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

type ProductCreateModalProps = {
    onClose: () => void;
};

export default function ProductCreateModal({ onClose }: ProductCreateModalProps) {
    // Champs de base
    const [title, setTitle] = useState<string>("");
    const [brand, setBrand] = useState<string>("");
    const [model, setModel] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [stock, setStock] = useState<number>(0);
    const [description, setDescription] = useState<string>("");

    // Tailles dynamiques
    const [sizes, setSizes] = useState<string[]>([]);
    const [goalLikes, setGoalLikes] = useState<number>(100);
    const addSize = () => setSizes((prev) => [...prev, ""]);
    const updateSize = (idx: number, value: string) =>
        setSizes((prev) => prev.map((s, i) => (i === idx ? value : s)));
    const removeSize = (idx: number) =>
        setSizes((prev) => prev.filter((_, i) => i !== idx));

    // Couleurs dynamiques
    const [colors, setColors] = useState<string[]>([]);
    const addColor = () => setColors((prev) => [...prev, ""]);
    const updateColor = (idx: number, value: string) =>
        setColors((prev) => prev.map((c, i) => (i === idx ? value : c)));
    const removeColor = (idx: number) =>
        setColors((prev) => prev.filter((_, i) => i !== idx));

    // Images locales à uploader
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Drag & drop order
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(images);
        const [removed] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, removed);
        setImages(items);
    };

    // Upload images et retourne les URL publiques
    const handleImageUpload = async (): Promise<string[] | undefined> => {
        const urls: string[] = []; // ✅ const (muter le contenu est OK)
        for (const file of images) {
            const filename = `${Date.now()}_${file.name}`;
            const { error } = await supabase.storage
                .from("products")
                .upload(filename, file, {
                    cacheControl: "3600",
                    upsert: false,
                });
            if (error) {
                toast.error("Erreur d'upload : " + error.message);
                return;
            }
            const { data: publicUrl } = supabase.storage
                .from("products")
                .getPublicUrl(filename);
            urls.push(publicUrl.publicUrl);
        }
        return urls;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Upload images dans Supabase Storage
        const uploadedImages = (await handleImageUpload()) ?? [];

        const newProduct = {
            title,
            brand,
            model,
            price: parseFloat(price),
            sizes: sizes.filter((s) => s.trim().length > 0),
            colors: colors.filter((c) => c.trim().length > 0),
            stock,
            image_url: uploadedImages[0] || "",
            images: uploadedImages || [],
            goal_likes: goalLikes,
            description,
            descriptions: [] as string[],
            features: [] as string[],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("products").insert([newProduct]);
        setLoading(false);

        if (!error) {
            toast.success("Produit ajouté !");
            onClose();
        } else {
            toast.error("Erreur : " + error.message);
        }
    };

    // Ajout de fichiers images
    const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setImages(files);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
                <h2 className="font-bold text-lg mb-4">Ajouter un produit</h2>

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
                        Images du produit (glisser pour réordonner)
                    </label>
                    <Input type="file" multiple accept="image/*" onChange={handleImageFiles} />
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="images" direction="horizontal">
                            {(provided) => (
                                <div
                                    className="flex mt-2 gap-2"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {images.map((img, idx) => (
                                        <Draggable
                                            key={img.name + idx}
                                            draggableId={img.name + idx}
                                            index={idx}
                                        >
                                            {(provided2) => (
                                                <div
                                                    ref={provided2.innerRef}
                                                    {...provided2.draggableProps}
                                                    {...provided2.dragHandleProps}
                                                    className="w-16 h-16 rounded border flex items-center justify-center overflow-hidden bg-gray-100"
                                                >
                                                    <img
                                                        src={URL.createObjectURL(img)}
                                                        className="object-contain w-full h-full"
                                                        alt={`Prévisualisation ${idx + 1}`}
                                                    />
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

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Objectif de likes</label>
                    <Input
                        type="number"
                        placeholder="Objectif likes"
                        value={goalLikes}
                        min={1}
                        onChange={(e) => setGoalLikes(Number(e.target.value))}
                        required
                    />
                </div>

                <div className="flex gap-2 mt-8">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Ajout..." : "Ajouter"}
                    </Button>
                    <Button variant="outline" type="button" onClick={onClose}>
                        Annuler
                    </Button>
                </div>
            </form>
        </div>
    );
}
