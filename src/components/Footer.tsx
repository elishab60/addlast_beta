import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import GradientBackground from "@/components/ui/gradient-background";

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-[#7CFF6B]/30 bg-black text-white font-mono">
            <GradientBackground />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,255,107,0.08),_transparent_55%)]" />

            <div className="container relative z-10 mx-auto px-4 py-12">
                <div className="flex flex-col items-center space-y-8">
                    {/* Brand */}
                    <div className="text-center">
                        <div className="mt-2 text-3xl font-bold text-white transition-colors duration-300">
                            add<span className="text-[#7CFF6B]">last</span>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
                        <Input
                            type="email"
                            placeholder="Ton email pour ne rien manquer"
                            className="h-11 flex-1 rounded-full border-white/20 bg-white/5 text-white placeholder:text-white/60 focus-visible:border-[#7CFF6B] focus-visible:ring-[#7CFF6B]/70"
                        />
                        <Button className="h-11 rounded-full bg-[#7CFF6B] px-6 font-semibold text-black transition-colors duration-300 hover:bg-[#68F081]">
                            Rejoindre
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium">
                        {[
                            { href: "/products", label: "Catalogue" },
                            { href: "/votes", label: "Votes" },
                            { href: "/precommandes", label: "Précommandes" },
                        ].map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="group relative text-white/70 transition-colors duration-200 hover:text-[#7CFF6B]"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#7CFF6B] transition-all duration-200 group-hover:w-full" />
                            </a>
                        ))}
                    </nav>

                    {/* Legal */}
                    <div className="flex flex-wrap justify-center gap-4 text-xs text-white/60">
                        {[
                            { href: "/mentions-legales", label: "Mentions légales" },
                            { href: "/confidentialite", label: "Confidentialité" },
                            { href: "/cgv", label: "CGV" },
                            { href: "/cgu", label: "CGU" },
                        ].map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="group relative transition-colors duration-200 hover:text-[#7CFF6B]"
                            >
                                {link.label}
                                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#7CFF6B] transition-all duration-200 group-hover:w-full" />
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-white/50">
                        <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#7CFF6B]/40 to-transparent" />
                        © {new Date().getFullYear()} addlast. Tous droits réservés.
                        <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#7CFF6B]/40 to-transparent" />
                    </div>
                </div>
            </div>
        </footer>
    )
}