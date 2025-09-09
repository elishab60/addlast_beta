"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


type Props = { images: string[] };

export default function ProductCarousel({ images }: Props) {
    const [idx, setIdx] = useState(0);

    return (
        <div className="relative w-full aspect-[4/3] bg-muted/30 rounded-2xl overflow-hidden flex items-center justify-center">
            <img src={images[idx]} alt="" className="object-contain w-full h-full transition-all"/>
            {images.length > 1 && (
                <>
                    <button
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow p-1"
                        onClick={() => setIdx((i) => (i === 0 ? images.length - 1 : i - 1))}
                        aria-label="Précédent"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow p-1"
                        onClick={() => setIdx((i) => (i === images.length - 1 ? 0 : i + 1))}
                        aria-label="Suivant"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}
            {/* Points de navigation */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <span
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                            idx === i ? "bg-black/90" : "bg-black/20"
                        }`}
                        onClick={() => setIdx(i)}
                        style={{ cursor: "pointer" }}
                    />
                ))}
            </div>
        </div>
    );
}
