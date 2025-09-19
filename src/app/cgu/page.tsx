"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function CguPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
                <h1 className="text-3xl font-bold mb-4 text-black transition-colors hover:text-accent">Conditions Générales d’Utilisation</h1>
                <p className="text-gray-600 text-lg mb-12">
                    Règles encadrant l’utilisation du site Add-Last
                </p>

                <div className="space-y-12 text-gray-800 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Objet</h2>
                        <p>
                            Les présentes CGU définissent les conditions d’accès et d’utilisation du site Add-Last. En accédant au
                            site, vous acceptez ces conditions sans réserve.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Accès au site</h2>
                        <p>
                            Le site est accessible 24h/24 et 7j/7, sauf interruption pour maintenance ou cas de force majeure. Add-Last
                            ne saurait être tenu responsable des interruptions ou dysfonctionnements liés à Internet.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Compte utilisateur</h2>
                        <p>
                            Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de la confidentialité
                            de vos identifiants et de toutes les activités réalisées avec votre compte.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Utilisation du site</h2>
                        <p>
                            Vous vous engagez à utiliser le site de manière loyale et légale. Toute utilisation frauduleuse ou abusive
                            pourra entraîner la suspension ou la suppression de votre compte.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Propriété intellectuelle</h2>
                        <p>
                            Les contenus du site (textes, images, logos, codes) sont protégés par le droit de la propriété intellectuelle.
                            Toute reproduction sans autorisation est interdite.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Données personnelles</h2>
                        <p>
                            Le traitement de vos données est encadré par notre{" "}
                            <a href="/confidentialite" className="text-black underline transition-colors hover:text-accent">
                                politique de confidentialité
                            </a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Responsabilité</h2>
                        <p>
                            Add-Last met tout en œuvre pour assurer l’exactitude des informations publiées. Nous ne saurions toutefois être
                            responsables des erreurs, omissions ou dommages liés à l’utilisation du site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-black pl-4 mb-4">Contact</h2>
                        <p>
                            Pour toute question relative aux présentes CGU, vous pouvez nous écrire à :{" "}
                            <a href="mailto:contact@add-last.com"
                               className="text-black underline transition-colors hover:text-accent">
                                contact@add-last.com
                            </a>.
                        </p>
                    </section>
                </div>
            </main>

            <Footer/>
        </div>
    )
}
