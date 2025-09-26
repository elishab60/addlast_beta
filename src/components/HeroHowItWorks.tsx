"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Shield, Users } from "lucide-react"

export default function HowItWorks() {
    return (
        <section className="pt-10 pb-20 px-6 md:pt-16 md:pb-32 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Title with hover underline animation */}
                <div className="text-center mb-16 md:mb-24">
            <span className="relative inline-block group">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-mono  font-bold text-black text-balance transition-colors duration-300 group-hover:text-accent-muted">
                Comment ça marche ?
              </h2>
              <span className="pointer-events-none absolute left-0 -bottom-2 h-0.5 bg-accent w-0 transition-all duration-300 group-hover:w-full"></span>
            </span>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 md:mb-20">
                    {/* Step 1: Vote */}
                      <div className="flex flex-col items-center text-center group animate-slide-up">
                          <div className="w-16 h-16 md:w-20 md:h-20 mb-6 flex items-center justify-center bg-black border-2 border-accent rounded-full transition-all duration-500 group-hover:bg-black group-hover:text-accent group-hover:scale-110 group-hover:shadow-lg">
                            <CheckCircle
                                className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:rotate-12 text-accent"
                                strokeWidth={1.5}
                            />
                        </div>
                          <h3 className="text-xl md:text-2xl font-mono font-bold mb-4 text-black text-balance transition-colors duration-300 group-hover:text-accent-muted">
                            Vote
                        </h3>
                        <p className="text-gray-600 font-mono  text-base md:text-lg leading-relaxed max-w-xs transition-all duration-300 group-hover:text-gray-800">
                            Vote pour les modèles que tu veux revoir.
                        </p>
                    </div>

                    {/* Step 2: Précommande */}
                      <div className="flex flex-col items-center text-center group animate-slide-up animation-delay-200">
                          <div className="w-16 h-16 md:w-20 md:h-20 mb-6 flex items-center justify-center bg-black border-2 border-accent rounded-full transition-all duration-500 group-hover:bg-black group-hover:text-accent group-hover:scale-110 group-hover:shadow-lg">
                            <Package
                                className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:rotate-12 text-accent"
                                strokeWidth={1.5}
                            />
                        </div>
                          <h3 className="text-xl md:text-2xl font-mono  font-bold mb-4 text-black text-balance transition-colors duration-300 group-hover:text-accent-muted">
                              Précommande
                          </h3>
                          <p className="text-gray-600 font-mono  text-base md:text-lg leading-relaxed max-w-xs transition-all duration-300 group-hover:text-gray-800">
                            Précommande quand la<br/>
                              marque valide.
                        </p>
                    </div>

                    {/* Step 3: Reçois */}
                    <div className="flex flex-col items-center text-center group animate-slide-up animation-delay-400">
                        <div
                            className="w-16 h-16 md:w-20 md:h-20 mb-6 flex items-center justify-center bg-black border-2 border-accent rounded-full transition-all duration-500 group-hover:bg-black group-hover:text-accent group-hover:scale-110 group-hover:shadow-lg">
                            <Shield
                                className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:rotate-12 text-accent"
                                strokeWidth={1.5}
                            />
                        </div>
                        <h3 className="text-xl md:text-2xl font-mono  font-bold mb-4 text-black text-balance transition-colors duration-300 group-hover:text-accent-muted">
                            Reçois
                        </h3>
                        <p className="text-gray-600 font-mono  text-base md:text-lg leading-relaxed max-w-xs transition-all duration-300 group-hover:text-gray-800">
                            Reçois ta paire, authentifiée NFC.
                        </p>
                    </div>

                    {/* Step 4: Collectionne */}
                    <div className="flex flex-col items-center text-center group animate-slide-up animation-delay-600">
                        <div
                            className="w-16 h-16 md:w-20 md:h-20 mb-6 flex items-center justify-center bg-black border-2 border-accent rounded-full transition-all duration-500 group-hover:bg-black group-hover:text-accent group-hover:scale-110 group-hover:shadow-lg">
                            <Users
                                className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:rotate-12 text-accent"
                                strokeWidth={1.5}
                            />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-4 font-mono  text-black text-balance transition-colors duration-300 group-hover:text-accent-muted">
                            Collectionne
                        </h3>
                        <p className="text-gray-600 font-mono text-base md:text-lg leading-relaxed max-w-xs transition-all duration-300 group-hover:text-gray-800">
                            Collectionne et partage avec la communauté.
                        </p>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="flex justify-center animate-fade-in animation-delay-800">
                    <Button size="lg" className="bg-black text-accent font-mono transition-all duration-300 hover:bg-accent hover:text-black px-8 py-3 text-base font-medium tracking-wide">
                        Commencer à voter
                    </Button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bounce-subtle {
                    0%,
                    20%,
                    50%,
                    80%,
                    100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-3px);
                    }
                    60% {
                        transform: translateY(-2px);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }

                .animate-slide-up {
                    animation: slide-up 0.6s ease-out forwards;
                }

                .animate-bounce-subtle {
                    animation: bounce-subtle 2s infinite;
                }

                .animation-delay-200 {
                    animation-delay: 0.2s;
                }

                .animation-delay-400 {
                    animation-delay: 0.4s;
                }

                .animation-delay-600 {
                    animation-delay: 0.6s;
                }

                .animation-delay-800 {
                    animation-delay: 0.8s;
                }
            `}</style>
        </section>
    )
}
