export default function HomeHowItWorks() {
    return (
        <section className="py-14 bg-gray-50 border-t border-gray-100">
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-7 text-center">Le process d’achat Addlast</h2>
                <ol className="space-y-6 text-lg text-gray-700">
                    <li>
                        <b>1. Vote :</b> Parcours le catalogue et like tes paires préférées.<br/>
                        Tu as droit à 2 votes par mois pour faire entendre ta voix !
                    </li>
                    <li>
                        <b>2. Sélection :</b> Les paires ayant atteint leur objectif de likes sont sélectionnées pour la précommande.
                    </li>
                    <li>
                        <b>3. Précommande :</b> Réserve ta paire, la fabrication démarre uniquement si le minimum de commandes est atteint (aucun risque).
                    </li>
                    <li>
                        <b>4. Livraison exclusive :</b> La paire est produite uniquement pour les votants et précommandeurs. Zéro surplus, zéro gâchis !
                    </li>
                </ol>
            </div>
        </section>
    );
}
