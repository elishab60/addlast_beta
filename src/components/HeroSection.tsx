"use client"

import { Button } from "@/components/ui/button"
import { HyperText } from "@/components/magicui/hyper-text"
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background animé */}
            <div className="absolute inset-0">
                <CanvasRevealEffect
                    animationSpeed={2}
                    containerClassName="bg-black"
                    colors={[
                        [0, 180, 0],   // Brighter green
                        [0, 220, 0],   // Even brighter green
                        [100, 255, 100], // Light green
                    ]}
                    dotSize={3}
                    opacities={[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1]}
                />
                {/* Overlay pour lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
            </div>

            {/* Contenu */}
            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12 px-4 py-8">
                {/* Titre animé */}
                <HyperText />

                {/* Image */}
                <div className="relative w-full max-w-3xl aspect-video mx-auto">
                    <Image
                        src="/heroyzyslide.webp"
                        alt="Sneaker collector premium"
                        fill
                        className="object-contain filter grayscale"
                        priority
                    />
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link href="/catalogue">
                        <Button
                            size="lg"
                            className="bg-accent text-black font-mono transition-all duration-300 hover:bg-black hover:text-[#7CFF6B] px-8 py-3 text-base font-medium tracking-wide"
                        >
                            Découvrir les paires
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
