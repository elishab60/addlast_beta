"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductCarouselProps {
    images: string[]
    productName: string
}

export function ProductCarousel({ images, productName }: ProductCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    return (
        <div className="space-y-4">
            {/* Image principale */}
            <div className="relative aspect-square bg-card rounded-lg overflow-hidden group">
                <img
                    src={images[currentIndex] || "/placeholder.svg"}
                    alt={`${productName} - Image ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Boutons de navigation */}
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={goToPrevious}
                        className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Image précédente</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={goToNext}
                        className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Image suivante</span>
                    </Button>
                </div>

                {/* Indicateur de position */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                    index === currentIndex ? "bg-primary" : "bg-background/50 hover:bg-background/70"
                                }`}
                                aria-label={`Aller à l'image ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Miniatures */}
            <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative aspect-square bg-card rounded-md overflow-hidden border-2 transition-colors duration-200 ${
                            index === currentIndex ? "border-primary" : "border-transparent hover:border-accent"
                        }`}
                    >
                        <img
                            src={image || "/placeholder.svg"}
                            alt={`${productName} - Miniature ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}
