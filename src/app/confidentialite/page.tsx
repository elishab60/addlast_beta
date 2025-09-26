"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function PolitiqueConfidentialitePage() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-mono ">
            <Header />

            <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
                <h1 className="text-3xl font-bold mb-4 text-black transition-colors hover:text-accent">Politique de Confidentialité</h1>
                <p className="text-gray-600 text-lg mb-12">
                    Protection et traitement de vos données personnelles
                </p>

                <div className="space-y-12 text-gray-800 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Introduction</h2>
                        <p>
                            Nous nous engageons à protéger votre vie privée. En utilisant ce site, vous acceptez le traitement de vos
                            données conformément à cette politique.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Principes de Protection</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Traitement légal, juste et transparent</li>
                            <li>Collecte limitée à l’objectif</li>
                            <li>Conservation limitée dans le temps</li>
                            <li>Exactitude et sécurité des données assurées</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Droits des Utilisateurs</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Droit d’accès, rectification et suppression</li>
                            <li>Droit d’opposition et de limitation</li>
                            <li>Droit à la portabilité</li>
                            <li>Droit de déposer une plainte auprès de la CNIL</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Cookies</h2>
                        <p>
                            Nous utilisons des cookies pour analyser l’usage du site et améliorer l’expérience utilisateur.
                            Vous pouvez gérer vos préférences dans votre navigateur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Contact</h2>
                        <p>
                            Pour toute question concernant vos données, contactez-nous à :{" "}
                            <a href="mailto:atrewind404@gmail.com" className="text-black underline transition-colors hover:text-accent">
                                atrewind404@gmail.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
