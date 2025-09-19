"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function CgvPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
                <h1 className="text-3xl font-bold mb-4 text-accent">Conditions Générales de Vente</h1>
                <p className="text-gray-600 text-lg mb-12">
                    Règles applicables à toutes les ventes conclues sur le site Add-Last
                </p>

                <div className="space-y-12 text-gray-800 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">Préambule</h2>
                        <p>
                            Toute commande passée sur le site Add-Last implique l’acceptation pleine et entière des présentes
                            Conditions Générales de Vente (CGV).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">Produits et disponibilité</h2>
                        <p>
                            Les produits proposés sont décrits et présentés avec la plus grande exactitude. Ils sont disponibles
                            dans la limite des stocks existants. Les photos sont non contractuelles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">Prix</h2>
                        <p>
                            Les prix affichés sont en euros, toutes taxes comprises, hors frais de livraison. Les frais applicables
                            sont précisés avant validation de la commande.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">Commandes et paiement</h2>
                        <p>
                            La commande devient définitive après confirmation du paiement. Les règlements sont acceptés par carte
                            bancaire et via les prestataires sécurisés indiqués. Add-Last se réserve le droit d’annuler toute
                            commande suspecte ou frauduleuse.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">Livraison</h2>
                        <p>
                            Les modalités et délais de livraison sont détaillés dans notre{" "}
                            <a href="/livraison" className="text-accent underline hover:text-accent-muted">
                                politique de livraison
                            </a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">Droit de rétractation</h2>
                        <p>
                            Conformément au Code de la consommation, vous disposez d’un délai de 14 jours à compter de la réception
                            pour exercer votre droit de rétractation, sans justification ni pénalité.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">Garanties</h2>
                        <p>
                            Nos produits bénéficient des garanties légales de conformité et contre les vices cachés.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold border-l-4 border-accent text-accent pl-4 mb-4">Service client</h2>
                        <p>
                            Pour toute question ou réclamation, contactez-nous à :{" "}
                            <a href="mailto:contact@add-last.com" className="text-accent underline hover:text-accent-muted">
                                contact@add-last.com
                            </a>.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
