import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
    return (
        <footer className="bg-white border-t border-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-black/5 to-transparent"></div>
                <div className="absolute top-4 left-4 w-2 h-2 bg-black rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-8 w-1 h-1 bg-black rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-black rounded-full animate-pulse delay-500"></div>
            </div>

            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="flex flex-col items-center space-y-8">
                    {/* Brand */}
                    <div className="text-center group">
                        <div className="relative">
                            <h3 className="text-2xl font-bold text-black transition-all duration-300 group-hover:scale-105 group-hover:tracking-wider">
                                addlast
                            </h3>
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md group">
                        <div className="relative flex-1">
                            <Input
                                type="email"
                                placeholder="Votre email"
                                className="border-black focus:ring-black focus:border-black transition-all duration-300 focus:shadow-lg focus:shadow-black/10 group-hover:border-gray-600"
                            />
                            <div className="absolute inset-0 border border-transparent group-focus-within:border-black/20 rounded-md transition-all duration-300 pointer-events-none"></div>
                        </div>
                        <Button className="bg-black text-white hover:bg-gray-800 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 active:scale-95">
                            Rejoindre la newsletter
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-wrap justify-center gap-6 text-sm">
                        {[
                            { href: "/products", label: "Catalogue" },
                            { href: "/votes", label: "Votes" },
                            { href: "/precommandes", label: "Précommandes" },
                            { href: "/communaute", label: "Communauté" },
                            { href: "/a-propos", label: "À propos" },
                        ].map((link, index) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-black font-medium relative group transition-all duration-300 hover:scale-105"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <span className="relative z-10">{link.label}</span>
                                <div className="absolute inset-0 bg-black scale-0 group-hover:scale-100 transition-transform duration-300 rounded-sm opacity-10"></div>
                                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></div>
                            </a>
                        ))}
                    </nav>

                    {/* Legal */}
                    <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600">
                        <a
                            href="/mentions-legales"
                            className="hover:text-black transition-all duration-300 hover:scale-105 relative group"
                        >
                            Mentions légales
                            <div className="absolute -bottom-0.5 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></div>
                        </a>
                        <a
                            href="/confidentialite"
                            className="hover:text-black transition-all duration-300 hover:scale-105 relative group"
                        >
                            Confidentialité
                            <div className="absolute -bottom-0.5 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></div>
                        </a>
                        <a href="/cgv" className="hover:text-black transition-all duration-300 hover:scale-105 relative group">
                            CGV
                            <div className="absolute -bottom-0.5 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></div>
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="relative">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent animate-pulse"></div>
                            <p className="text-xs text-gray-600 text-center transition-all duration-300 hover:text-black">
                                © 2025 addlast. Tous droits réservés.
                            </p>
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-black to-transparent animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
