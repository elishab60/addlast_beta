"use client"

import { Card } from "@/components/ui/card"
import { Music, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface InstagramPost {
    id: string
    title: string
    thumbnail: string
    isReel?: boolean
    url: string
}

const mockInstagramPosts: InstagramPost[] = [
    {
        id: "1",
        title: 'Nouvelle collection Air Jordan 4 "Black Cat"',
        thumbnail: "/placeholder.svg?height=400&width=400",
        url: "#",
    },
    {
        id: "2",
        title: 'Nike Dunk Low "Panda" unboxing',
        thumbnail: "/placeholder.svg?height=400&width=400",
        url: "#",
    },
    {
        id: "3",
        title: "Comment nettoyer ses sneakers blanches",
        thumbnail: "/placeholder.svg?height=600&width=400",
        isReel: true,
        url: "#",
    },
    {
        id: "4",
        title: 'Adidas Yeezy 350 V2 "Zebra"',
        thumbnail: "/placeholder.svg?height=400&width=400",
        url: "#",
    },
    {
        id: "5",
        title: 'New Balance 550 "White Green"',
        thumbnail: "/placeholder.svg?height=400&width=400",
        url: "#",
    },
    {
        id: "6",
        title: "Travis Scott Jordan collaboration",
        thumbnail: "/placeholder.svg?height=400&width=400",
        url: "#",
    },
]

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

const InstagramPostCard = ({ post }: { post: InstagramPost }) => {
    return (
        <Card
            className={cn(
                "group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-gray-200 bg-white",
                post.isReel ? "aspect-[3/4]" : "aspect-square",
            )}
        >
            <div className="relative w-full h-full bg-black">
                <img
                    src={post.thumbnail || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 grayscale"
                />

                {/* Dark overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Reel indicator */}
                {post.isReel && (
                    <div className="absolute top-3 right-3 bg-white rounded-full p-2">
                        <Music className="w-4 h-4 text-black" />
                    </div>
                )}

                {/* Text container with solid dark background */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/95 p-4">
                    <p className="text-sm font-medium text-white text-balance leading-tight">{post.title}</p>
                </div>
            </div>
        </Card>
    )
}

export default function SocialMediaBentoGrid() {
    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-12 bg-white">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-black mb-8">Nous suivre sur les réseaux</h2>

                <div className="flex justify-center items-center gap-8 mb-12">
                    <div className="text-center group">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-3 mx-auto transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-gray-800 cursor-pointer">
                            <TikTokIcon className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm font-medium text-black transition-colors group-hover:text-gray-600">
                            @add_last
                        </p>
                        <p className="text-xs text-gray-600">TikTok</p>
                    </div>

                    <div className="text-center group">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-3 mx-auto transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-gray-800 cursor-pointer">
                            <InstagramIcon className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm font-medium text-black transition-colors group-hover:text-gray-600">@add_last</p>
                        <p className="text-xs text-gray-600">Instagram</p>
                    </div>

                    <div className="text-center group">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-3 mx-auto transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-gray-800 cursor-pointer">
                            <YouTubeIcon className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm font-medium text-black transition-colors group-hover:text-gray-600">@add-last</p>
                        <p className="text-xs text-gray-600">YouTube</p>
                    </div>
                </div>
            </div>

            <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-black mb-6">Notre podcast</h3>
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gray-100 rounded-t-lg p-3 flex items-center gap-2">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600 text-left">
                            youtube.com/watch?v=addlast-podcast
                        </div>
                    </div>
                    <div className="bg-black rounded-b-lg aspect-video flex items-center justify-center group cursor-pointer transition-all duration-300 hover:bg-gray-800">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                                <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                            <p className="text-white font-medium">Addlast Podcast - Épisode 1</p>
                            <p className="text-gray-300 text-sm">L&apos;histoire des sneakers iconiques</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                            <InstagramIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-black">@add_last</h3>
                            <p className="text-sm text-gray-600">Nous suivre sur Instagram</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 max-w-4xl mx-auto">
                    {/* Left side: 2x2 grid of square posts */}
                    <div className="flex-1 grid grid-cols-2 gap-3">
                        {mockInstagramPosts.slice(0, 4).map((post) => (
                            <InstagramPostCard key={post.id} post={{ ...post, isReel: false }} />
                        ))}
                    </div>

                    {/* Right side: Single vertical reel */}
                    <div className="w-48">
                        <InstagramPostCard post={mockInstagramPosts[2]} />
                    </div>
                </div>
            </div>
        </section>
    )
}
//https://www.tiktok.com/@add_last
//https://www.instagram.com/add_last/
//https://www.youtube.com/@add-last