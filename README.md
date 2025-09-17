Addlast est une plateforme e-commerce Next.js 15/React 19 qui s’appuie sur Tailwind CSS 4 pour permettre à la communauté de voter, précommander et collectionner des sneakers rares, tout en exploitant Supabase pour l’authentification, la persistance et le stockage des médias.
L’interface globale charge les polices Geist, encapsule toute l’application dans un CartProvider persistant côté navigateur et expose les notifications temps réel via Sonner pour uniformiser les interactions utilisateur.
Fonctionnalités clés
Accueil immersif : la page d’accueil combine un héros animé via HyperText, un tutoriel « Comment ça marche », un carrousel de produits votables et un mur social TikTok/Instagram/YouTube pour valoriser la communauté.
Catalogue dynamique : recherche plein texte, filtres marque/modèle et accès direct aux fiches produits ou à la soumission d’une nouvelle paire.
Fiche produit riche : galerie ProductCarousel, suivi du quota de votes, vote unique mensuel, sélection de taille sauvegardable et ajout au panier (précommande).
Votes & précommandes : limite de deux votes par utilisateur et par mois, classement des paires et passage automatique en précommande lorsque l’objectif de likes est atteint.
Panier & wishlist persistants : panier stocké en localStorage, compteur global dans l’en-tête et wishlist basée sur les votes du mois en cours (max. 2).
Compte & profil : tableau de bord en mosaïque permettant de modifier coordonnées, pointure, adresse et abonnement newsletter, avec sauvegarde Supabase.
Suggestions communautaires : formulaire réservé aux membres avec anti-spam (1 proposition tous les 90 jours) et interface d’administration dédiée.
Back-office complet : navigation latérale entre commandes (placeholder), utilisateurs, produits, votes et suggestions, avec modals de création/édition et suivi statistique.
Architecture & organisation
Structure des dossiers
src/app/ : routes App Router (pages publiques, auth, compte, admin, pages légales, etc.).
src/components/ : composants UI réutilisables, carrousels, formulaires, mosaïques et bibliothèques d’interface (Shadcn, Magic UI, etc.).
src/context/ : contextes React (panier).
src/lib/ : clients Supabase (client/serveur) et utilitaires cn.
src/types/ : définitions TypeScript partagées pour produits et profils.
public/ : médias statiques (icônes, visuels héro, etc.).
Stack technique
Next.js 15.4 (App Router), React 19, TypeScript et Turbopack pour le développement.
Tailwind CSS 4 & tw-animate-css pour la theming et les animations globales.
Shadcn UI (boutons, cartes, modals, sélecteurs), Lucide Icons, Motion/Framer pour les micro-interactions.
Supabase : authentification, base de données Postgres, stockage products, helpers client/serveur et toasts Sonner pour les retours utilisateurs.
Gestion de l’état & données
Panier : contexte React persistant (localStorage) additionnant les quantités par produit/taille et exposant count pour le badge d’en-tête.
Supabase client : toutes les pages client (catalogue, votes, wishlist, admin, etc.) consomment les tables via le client JS, tandis que supabaseServer est prêt pour des composants server si besoin.
Notifications : Sonner est disponible partout grâce au Toaster global, utilisé aussi bien dans les formulaires d’authentification, que dans la soumission de paires ou l’admin produits.
Parcours utilisateur
Accueil
Héros plein écran avec effet de texte scramble HyperText, illustration next/image et CTA vers le catalogue.
Section « Comment ça marche » en quatre étapes (vote, précommande, réception NFC, collection), suivie d’un CTA pour voter.
CatalogCarousel : cartes produit avec vote mensuel limité, progression vers l’objectif de likes, badge d’état (« En vote », « En précommande », « Rupture »).
Mur social : liens stylisés vers TikTok/Instagram/YouTube + embeds Instagram automatisés.
Navigation & layout
En-tête sticky avec navigation, état de connexion, accès admin conditionnel et badges wishlist/panier, décliné en version mobile via Sheet Radix.
Pied de page premium : bloc newsletter, raccourcis catalogue/votes/précommandes, pages légales et copyright.
Overlay app/loading prêt pour les transitions globales.
Catalogue & fiches produit
Page /products : recherche, filtres marque/modèle, grille responsive et CTA pour proposer une paire.
Fiche produit : carrousel d’images, progression des votes, bouton « Voter », sélection de pointure (avec sauvegarde dans Supabase), guide des tailles et ajout au panier lorsque le quota est atteint.
Ajout au panier déclenche addToCart (produit/pointure/quantité) puis notification de succès.
Votes & précommandes
Page /votes : hero explicatif, podium des paires les plus votées, grille complète et redirection vers les précommandes (limite 2 votes/mois).
Page /precommandes : ne liste que les produits dont les likes ≥ objectif, sinon encourage à retourner voter.
Panier & wishlist
Panier (/cart) : persistance locale, affichage détaillé des lignes, calcul du total et CTA « Passer la précommande ».
Wishlist (/wishlist) :
visiteur : incitation à créer un compte.
membre : chargement de ses votes des 30 derniers jours (max 2) et rendu des paires likées.
Compte & authentification
Auth : formulaires de connexion, d’inscription (CGU obligatoires, création du profil client) et de demande de reset email vers /reset-password (à créer côté front).
Compte (/account) : chargement du profil Supabase puis affichage du composant UserProfileBento (infos perso, pointure, newsletter, adresse, statut, bouton de sauvegarde).
Suggestions & communauté
/proposer : formulaire texte (min 20 caractères), anti-abus (1 soumission/90 jours) et redirection vers la connexion si nécessaire.
/social intégré via la section bento (voir plus haut).
Pages légales
Mentions légales, politique de confidentialité, CGU et CGV sont déjà rédigées et accessibles depuis le footer.
Administration
Navigation latérale : commandes (placeholder), utilisateurs, produits, votes, soumissions.
Utilisateurs : table responsive (email, prénom, newsletter, adresse, rôle) avec recherche instantanée.
Produits : tableau CRUD avec vignettes, modals d’édition/creation (tailles/couleurs dynamiques, description, objectifs de likes, upload via Supabase Storage products).
Votes (likes) : tableau analytique (périodes 7/30/90 jours, total, objectif, progression, lien vers la fiche).
Soumissions communauté : liste chronologique des idées utilisateurs pour inspiration produit.
Intégration Supabase
Variables d’environnement
Créer un fichier .env.local avec :
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
Ces variables alimentent le client Supabase (et sont réutilisées côté serveur via supabaseServer).
Tables attendues
Table	Colonnes clefs	Usage
products	id, title, brand, model, price, sizes[], colors[], stock, goal_likes, status, image_url, images[], description, timestamps	Catalogue, votes, précommandes, admin CRUD.
votes	id, user_id, product_id, created_at	Suivi des likes/votes mensuels, quotas et progression.
profiles	id, prenom, nom, email, dob, newsletter, created_at, pointure, adresse, ville, code_postal, pays, role	Informations compte, newsletter, rôle admin, tailles, adresses.
submissions	id, user_id, message, created_at	Suggestions de paires et interface d’admin correspondante.
Stockage
Bucket public products pour héberger les images (upload côté admin via supabase.storage.from("products")).
Authentification & règles
Auth Supabase email/mot de passe, création de profil role="client" à l’inscription et segmentation admin via profiles.role === "admin" pour afficher la navigation dédiée.
Pensez à ajuster les politiques RLS pour autoriser lecture/écriture des tables ci-dessus selon vos exigences (votes limités par utilisateur, profil éditable uniquement par son propriétaire, etc.).
Démarrage
Prérequis
Node.js et npm/yarn compatibles avec Next 15 (recommandé : Node 18+).
Compte Supabase avec tables et bucket décrits ci-dessus.
Installation
Cloner le dépôt puis installer les dépendances : npm install.
Créer .env.local avec les variables Supabase.
Lancer le serveur de développement : npm run dev (Turbopack activé).
Ouvrir http://localhost:3000.
Scripts npm
npm run dev : mode développement.
npm run build : build production.
npm run start : serveur production.
npm run lint : lint Next/ESLint.
Notes & bonnes pratiques
CartContext sauvegarde automatiquement les données en localStorage : prévoyez une logique de suppression/édition si nécessaire.
ForgotPasswordForm redirige vers /reset-password après email ; créez la page correspondante pour finaliser le flux de réinitialisation.
Les uploads admin utilisent @hello-pangea/dnd pour réordonner les médias ; vérifiez que le bucket Supabase est configuré en lecture publique et que les quotas de stockage sont suffisants.
Les effets Motion/Tailwind fournissent des animations par défaut ; adaptez-les pour respecter vos exigences d’accessibilité (prévoir des alternatives si prefers-reduced-motion).
Les pages légales sont déjà en place (footer) mais pensez à les compléter avec vos données réelles avant mise en production.