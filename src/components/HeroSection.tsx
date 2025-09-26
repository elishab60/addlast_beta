"use client"

import { Button } from "@/components/ui/button"
import { HyperText } from "@/components/magicui/hyper-text"
import GradientBackground from "@/components/ui/gradient-background"
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background animé simple */}
            <GradientBackground />
            {/* Overlay léger pour lisibilité */}
            <div className="absolute inset-0 bg-black/40" />

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
