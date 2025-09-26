"use client"

import { Button } from "@/components/ui/button"
import { HyperText } from "@/components/magicui/hyper-text";
export function HyperTextDemo() {
    return <HyperText>Hover Me!</HyperText>;
}

import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {

    return (
        <section className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-4 py-4">
            <div className="max-w-4xl mx-auto text-center space-y-12">
                {/* Heading */}
                <HyperText/>
                {/* Image (16/9) */}
                <div className="relative w-full max-w-3xl aspect-video mx-auto">
                    <Image
                        src="/heroyzyslide.webp"
                        alt="Sneaker collector premium"
                        fill
                        className="object-contain filter grayscale"
                        priority
                    />
                </div>

                {/* Morphing Text */}
                {/* <div className="pt-8 "><MorphingText texts={texts} className="font-semibold text-xl md:text-2xl text-black" /></div> */}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link href="/catalogue">
                        <Button size="lg" className="bg-black text-accent font-mono transition-all duration-300 hover:bg-accent hover:text-black px-8 py-3 text-base font-medium tracking-wide">
                            Découvrir les paires
                        </Button>
                    </Link>
                </div>


            </div>
        </section>
    )
}
