# Addlast – Plateforme communautaire de sneakers

Bienvenue sur Addlast ! Ce dépôt héberge le code d’une application e-commerce Next.js/Tailwind qui permet à la communauté de proposer, voter et précommander des sneakers rares. Ce document a été pensé pour **toute personne qui découvre le projet**, y compris les néophytes : il explique le fonctionnement du site, la structure du code et la manière de contribuer en toute autonomie.

---

## 📚 Sommaire

1. [Aperçu rapide du produit](#-aperçu-rapide-du-produit)
2. [Architecture technique en quelques mots](#-architecture-technique-en-quelques-mots)
3. [Prise en main immédiate](#-prise-en-main-immédiate)
4. [Organisation du code et conventions](#-organisation-du-code-et-conventions)
5. [Parcours utilisateur et composants clés](#-parcours-utilisateur-et-composants-clés)
6. [Données, Supabase & configuration](#-données-supabase--configuration)
7. [Qualité logicielle : scripts & tests](#-qualité-logicielle--scripts--tests)
8. [Guide contribution pas à pas](#-guide-contribution-pas-à-pas)
9. [Foire aux questions & dépannage](#-foire-aux-questions--dépannage)
10. [Ressources complémentaires](#-ressources-complémentaires)

---

## 🚀 Aperçu rapide du produit

- **Mission** : réunir la communauté sneaker autour de votes mensuels. Quand une paire atteint son quota de likes, elle passe en précommande directement sur la plateforme.
- **Utilisateurs cibles** : passionnés de sneakers (front-office) et équipe Addlast (back-office).
- **Expérience clé** :
  - Les visiteurs découvrent l’univers Addlast, les règles de vote et les réseaux sociaux.
  - Les membres créent un compte, votent pour deux paires par mois, gèrent leur wishlist et leurs précommandes.
  - L’équipe admin pilote le catalogue, suit les votes et valide les suggestions communautaires.
- **Technologies principales** : Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Supabase (auth + base de données + stockage), Sonner pour les toasts, shadcn/ui pour les composants.

---

## 🏗️ Architecture technique en quelques mots

| Couche | Description | Technologies |
| --- | --- | --- |
| UI & routes | Pages publiques, authentification, compte, admin et API route handlers côté Next | Next.js (App Router), React Server/Client Components |
| Présentation | Composants UI, carrousels, formulaires, toasts, transitions | shadcn/ui, Tailwind CSS, Framer Motion, Lucide |
| État & logique front | Contexte panier, hooks Supabase, formulaires | React Context, hooks personnalisés |
| Données | Authentification, stockage des profils, produits, votes, suggestions | Supabase (Auth, Postgres, Storage) |
| Stockage local | Persistance du panier côté navigateur | `localStorage`

L’application est **côté front uniquement** (pas de serveur custom). Supabase sert de back-end temps réel.

---

## 🏁 Prise en main immédiate

### 1. Prérequis

- Node.js ≥ 18.
- npm (installé avec Node) ou pnpm/yarn si vous préférez.
- Un compte [Supabase](https://supabase.com/) gratuit suffit pour démarrer.

### 2. Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/<votre-compte>/addlast.git
cd addlast

# 2. Installer les dépendances
npm install
```

### 3. Configuration locale

Créez un fichier `.env.local` à la racine :

```bash
cp .env.example .env.local  # si le fichier d'exemple existe
```

Sinon, ajoutez manuellement les variables nécessaires :

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<votre-projet>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé-anonyme>
```

> 💡 Ces variables sont utilisées à la fois côté client et côté serveur (via les helpers `supabaseClient` et `supabaseServer`).

### 4. Lancer l’application

```bash
npm run dev
# Ouvrir http://localhost:3000
```

Le serveur de développement repose sur Turbopack : les mises à jour sont instantanées.

### 5. Construire et tester (optionnel)

```bash
npm run lint   # vérifie la qualité du code
npm run build  # construit la version production
```

---

## 🗂️ Organisation du code et conventions

```
.
├── src/
│   ├── app/             # Routes (App Router) + layouts + pages (client/server components)
│   │   ├── (marketing)/ # Pages publiques : accueil, mentions légales, CGU, etc.
│   │   ├── (store)/     # Pages catalogues, votes, précommandes, panier, wishlist…
│   │   ├── account/     # Espace utilisateur (profil, paramètres)
│   │   ├── admin/       # Back-office (produits, votes, utilisateurs, suggestions)
│   │   └── api/         # Route handlers côté serveur (si nécessaire)
│   ├── components/      # Composants UI partagés (carrousels, modals, formulaires…)
│   ├── context/         # Contextes React (ex. panier)
│   ├── lib/             # Utilitaires (Supabase client/server, helpers Tailwind…)
│   ├── types/           # Types TypeScript partagés (produits, profils, votes)
│   └── styles/          # Styles globaux et thèmes (si présents)
├── public/              # Assets statiques (icônes, images hero, logos…)
├── next.config.ts       # Configuration Next.js
├── tailwind.config.ts   # Configuration Tailwind CSS
├── postcss.config.mjs   # Pipeline CSS
└── package.json         # Scripts npm et dépendances
```

### Règles de code majeures

- **TypeScript obligatoire** : types forts pour les données produits/profils/votes.
- **Composants fonctionnels** uniquement, pas de classes.
- **Tailwind CSS** pour le style + utilitaire `cn` (merge conditionnel de classes).
- **Pas de logique complexe dans les composants** : créer des hooks utilitaires dans `src/lib/` ou `src/hooks/` (à créer si besoin).
- **Contextes React** pour l’état global (actuellement le panier).
- **shadcn/ui** : privilégiez les composants existants (Button, Card, Dialog, Sheet, etc.).
- **Accessibilité** : vérifier les attributs ARIA, le focus et l’état désactivé des boutons.

---

## 🧭 Parcours utilisateur et composants clés

### 1. Pages marketing (visiteurs non connectés)

| Page | Objectif | Composants clés |
| --- | --- | --- |
| `/` | Présenter Addlast, expliquer le vote, mettre en avant les réseaux sociaux | `Hero`, `HyperText`, `HowItWorks`, `CatalogCarousel`, `SocialWall` |
| `/legal/*` | Pages légales (CGU, CGV, mentions, politique de confidentialité) | Composants statiques, typographie Tailwind |

### 2. Expérience membre (après connexion)

| Page | Objectif | Particularités |
| --- | --- | --- |
| `/products` | Explorer le catalogue, filtrer, accéder aux fiches produit | Recherche, filtres brand/model, cartes responsives |
| `/products/[id]` | Voir une fiche produit détaillée | `ProductCarousel`, progression des votes, sélection de pointure, ajout panier |
| `/votes` | Voter (max 2/mois) et suivre le classement | Composant `VotesLeaderboard`, toasts de confirmation |
| `/precommandes` | Précommander les paires qui ont atteint leur objectif | Statut produit `status === "preorder"` |
| `/cart` | Gérer son panier persistent | `CartContext`, calcul du total, CTA précommande |
| `/wishlist` | Retrouver ses votes récents | Lecture Supabase `votes` du mois courant |
| `/account` | Gérer ses informations | `UserProfileBento`, formulaires shadcn |
| `/proposer` | Soumettre une nouvelle paire | Formulaire texte + anti-spam (1/90 jours) |

### 3. Administration

Accessible uniquement si `profiles.role === "admin"`.

- **Dashboard général** : navigation latérale + aperçu rapide.
- **Utilisateurs** : table responsive avec recherche instantanée, switch newsletter, rôles.
- **Produits** : CRUD complet (images via Supabase Storage, tailles/couleurs dynamiques, objectif de likes).
- **Votes** : vue analytique (totaux sur 7/30/90 jours, progression vers l’objectif).
- **Soumissions** : validation des idées envoyées par la communauté.

### 4. Composants transverses

- `CartProvider` : fournit `cartItems`, `addToCart`, `removeFromCart`, `clearCart` et calcule `count` pour l’icône panier.
- `SupabaseProvider` (selon implémentation) : facilite l’accès au client Supabase côté client/server.
- `Toaster` (Sonner) : feedback utilisateur global.
- `HyperText` et `Motion` : animations d’entrée sur la page d’accueil.

---

## 🗃️ Données, Supabase & configuration

### Tables principales à créer

| Table | Colonnes essentielles | Description |
| --- | --- | --- |
| `products` | `id`, `title`, `brand`, `model`, `price`, `sizes (text[])`, `colors (text[])`, `stock`, `goal_likes`, `status`, `image_url`, `images (text[])`, `description`, timestamps | Catalogue, votes, précommandes, admin CRUD |
| `votes` | `id`, `user_id`, `product_id`, `created_at` | Trace chaque vote (limite 2/mois par utilisateur) |
| `profiles` | `id`, `prenom`, `nom`, `email`, `dob`, `newsletter`, `pointure`, `adresse`, `ville`, `code_postal`, `pays`, `role`, timestamps | Stocke les informations de compte + rôle admin |
| `submissions` | `id`, `user_id`, `message`, `created_at` | Idées de paires proposées par la communauté |

> 🔒 Pensez à activer les **politiques RLS** (Row Level Security) :
> - `profiles` : lecture/écriture uniquement par le propriétaire (sauf admins).
> - `votes` : limiter à 2 enregistrements par utilisateur et par mois (vérification dans le code + RLS si possible).
> - `products` : lecture publique, écriture réservée aux admins.

### Script SQL d’exemple (à adapter)

```sql
create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brand text not null,
  model text,
  price numeric(10,2) not null,
  sizes text[] default '{}',
  colors text[] default '{}',
  stock integer default 0,
  goal_likes integer default 100,
  status text default 'vote',
  image_url text,
  images text[] default '{}',
  description text,
  inserted_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamp with time zone default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  prenom text,
  nom text,
  email text unique,
  dob date,
  newsletter boolean default false,
  pointure text,
  adresse text,
  ville text,
  code_postal text,
  pays text,
  role text default 'client',
  created_at timestamp with time zone default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  message text not null,
  created_at timestamp with time zone default now()
);
```

### Stockage Supabase

- Créez un **bucket public** `products` pour héberger les images.
- Les pages admin utilisent `supabase.storage.from('products')` pour l’upload et la suppression.

### Authentification

- Flux e-mail/mot de passe natif Supabase.
- Lors de l’inscription, le code crée un profil dans `profiles` avec `role="client"`.
- Les utilisateurs avec `role="admin"` voient automatiquement la navigation back-office.

---

## ✅ Qualité logicielle : scripts & tests

| Commande | Description |
| --- | --- |
| `npm run dev` | Lance le serveur Next.js en mode développement |
| `npm run build` | Compile le projet pour la production |
| `npm run start` | Démarre le serveur sur la build production |
| `npm run lint` | Vérifie le code avec ESLint/TypeScript |

> 💡 Aucun test unitaire n’est encore défini. Si vous ajoutez Vitest/Jest ou Playwright, documentez vos scripts ici.

### Bonnes pratiques supplémentaires

- Validez vos modifications avec `npm run lint` avant de pousser.
- Respectez le typage TypeScript et corrigez les avertissements (VSCode vous aidera).
- Ajoutez des captures d’écran/GIF dans vos PR pour les changements UI.

---

## 🤝 Guide contribution pas à pas

1. **Forker le dépôt** (ou créer une branche si vous êtes déjà collaborateur).
2. `git clone` votre fork puis `npm install`.
3. Créez une branche dédiée à votre fonctionnalité : `git checkout -b feat/ma-feature`.
4. Codez en respectant les conventions ci-dessus.
5. Vérifiez votre code : `npm run lint` (et tests si disponibles).
6. Commitez (`git commit`) avec un message explicite : `feat: add product size selector validation`.
7. Poussez votre branche (`git push origin feat/ma-feature`).
8. Ouvrez une Pull Request :
   - Décrivez le contexte, les changements, les tests effectués.
   - Ajoutez des captures d’écran si l’UI change.
   - Citez les issues associées (`Closes #123`).
9. Attendez la review et appliquez les retours.

### Checklist PR rapide

- [ ] Lint passé (`npm run lint`).
- [ ] Aucun warning TypeScript.
- [ ] Fonctionnalité testée dans le navigateur.
- [ ] Documentation/README mis à jour si nécessaire.

---

## ❓ Foire aux questions & dépannage

**Q : Le site ne se lance pas en local.**  
A : Vérifiez que `npm install` s’est déroulé sans erreur et que Node ≥ 18. Contrôlez les variables dans `.env.local`.

**Q : J’obtiens une erreur Supabase “Invalid API key”.**  
A : Assurez-vous d’utiliser la clé anonyme (non la clé service). Rafraîchissez la page si vous avez changé la clé.

**Q : Les images produits ne s’affichent pas.**  
A : Activez les règles publiques du bucket `products` ou ajoutez un [policy public read](https://supabase.com/docs/guides/storage#policy-examples).

**Q : Comment limiter les votes à 2 par mois ?**  
A : La logique est côté front (comptage par utilisateur). Pour une sécurité maximale, ajoutez une politique RLS qui refuse les insertions >2 sur la période souhaitée.

**Q : Où ajouter une nouvelle page ?**  
A : Créez un dossier dans `src/app/`. Pour une page marketing, utilisez `src/app/(marketing)/ma-page/page.tsx`. Next.js générera automatiquement la route.

**Q : Puis-je utiliser une autre librairie de composants ?**  
A : shadcn/ui est la base. Pour rester cohérent, réutilisez ses primitives (Button, Card…). Si vous ajoutez une nouvelle lib, discutez-en via issue/PR.

---

## 📎 Ressources complémentaires

- [Documentation Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS v4 (preview)](https://tailwindcss.com/)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Sonner – toasts](https://sonner.emilkowal.ski/)
- [Framer Motion](https://www.framer.com/motion/)

---

Besoin d’aide supplémentaire ? Ouvrez une issue GitHub ou contactez l’équipe Addlast. Bonne contribution ! 👟

