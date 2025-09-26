"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"


const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04 0z" />
    </svg>
)

const YouTubeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.849 0-3.204.013-3.583.072-4.948.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
)

declare global {
    interface Window {
        instgrm?: {
            Embeds: {
                process: () => void
            }
        }
    }
}

// --- Embeds Instagram ---
const instagramPosts = [
    "https://www.instagram.com/reel/DKaWOYTsCtY/",
    "https://www.instagram.com/reel/DMlFarZqO3H/",
    "https://www.instagram.com/p/DObXFNakzs4/",
]

function InstagramEmbed({ url }: { url: string }) {
    useEffect(() => {
        const existing = document.querySelector<HTMLScriptElement>(
            'script[src="https://www.instagram.com/embed.js"]'
        )
        if (!existing) {
            const s = document.createElement("script")
            s.src = "https://www.instagram.com/embed.js"
            s.async = true
            document.body.appendChild(s)
        } else {
            window.instgrm?.Embeds?.process()
        }
    }, [url])

    return (
        <blockquote
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            data-instgrm-captioned
            style={{ background: "#fff", border: 0, borderRadius: 12, margin: 0, width: "100%" }}
        >
            <a href={url} target="_blank" rel="noreferrer">
                &nbsp;
            </a>
        </blockquote>
    )
}

export default function SocialMediaBentoGrid() {
    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-12 bg-white font-mono">
            {/* Header Réseaux */}
            <div className="text-center mb-12">
                <h2 className="text-xl md:text-3xl lg:text-3xl font-bold text-black text-balance transition-colors duration-300 group-hover:text-accent-muted">Nous suivre sur les réseaux</h2>
<br/><br/>
                <div className="flex justify-center items-center gap-8 mb-12">
                    <Link href="https://www.tiktok.com/@add_last" target="_blank" className="text-center group">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-3 mx-auto transition hover:scale-110 hover:shadow-lg hover:bg-gray-800">
                            <TikTokIcon className="w-8 h-8 text-accent" />
                        </div>
                        <p className="text-sm font-medium text-black group-hover:text-accent-muted">@add_last</p>
                        <p className="text-xs text-gray-600">TikTok</p>
                    </Link>

                    <Link
                        href="https://www.instagram.com/add_last?utm_source=ig_web_button_share_sheet&igsh=MXd5ZjBncm5jaWxz"
                        target="_blank"
                        className="text-center group"
                    >
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-3 mx-auto transition hover:scale-110 hover:shadow-lg hover:bg-gray-800">
                            <InstagramIcon className="w-8 h-8 text-accent" />
                        </div>
                        <p className="text-sm font-medium text-black group-hover:text-accent-muted">@add_last</p>
                        <p className="text-xs text-gray-600">Instagram</p>
                    </Link>

                    <Link href="https://www.youtube.com/@add-last" target="_blank" className="text-center group">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-3 mx-auto transition hover:scale-110 hover:shadow-lg hover:bg-gray-800">
                            <YouTubeIcon className="w-8 h-8 text-accent" />
                        </div>
                        <p className="text-sm font-medium text-black group-hover:text-accent-muted">@add-last</p>
                        <p className="text-xs text-gray-600">YouTube</p>
                    </Link>
                </div>
            </div>

            {/* Bloc Instagram : 3 posts alignés */}
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                            <InstagramIcon className="w-6 h-6 text-accent" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-accent">@add_last</h3>
                            <p className="text-sm text-gray-600">Dernières publications</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {instagramPosts.map((url) => (
                        <Card key={url} className="p-0 overflow-hidden">
                            <InstagramEmbed url={url} />
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
