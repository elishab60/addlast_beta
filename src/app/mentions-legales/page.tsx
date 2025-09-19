"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function MentionsLegalesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
                <h1 className="text-3xl font-bold mb-4 text-accent">Mentions Légales</h1>
                <p className="text-gray-600 text-lg mb-12">
                    Informations légales concernant le site Add-Last
                </p>

                <div className="space-y-12 text-gray-800 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">Éditeur</h2>
                        <p className="font-medium">Add-Last SAS</p>
                        <p>44 avenue Barbes, 93420 Villepinte</p>
                        <p>Capital social : 1000€</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">Gérance</h2>
                        <p><span className="font-medium">Président :</span> MERCIER Thibault</p>
                        <p><span className="font-medium">Directeur général :</span> MARTINEAU Alexis</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">Hébergeur</h2>
                        <p>Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                        <a
                            href="https://vercel.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent underline hover:text-accent-muted"
                        >
                            → Visiter Vercel
                        </a>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">Propriété Intellectuelle</h2>
                        <p>
                            Toute reproduction ou représentation du contenu doit faire l’objet d’une autorisation préalable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">RGPD</h2>
                        <p>
                            Pour toute question relative à vos données, consultez notre{" "}
                            <a href="/confidentialite" className="text-accent underline hover:text-accent-muted">
                                politique de confidentialité
                            </a>.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
