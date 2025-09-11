This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 État du Projet

✅ **PROJET DÉPLOYABLE** - Toutes les corrections critiques ont été appliquées.

Voir le [Guide de Déploiement](./DEPLOYMENT_GUIDE.md) pour les instructions complètes.

## Getting Started

First, configure your environment variables:

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
```

Then, run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses system fonts for better build compatibility and performance.

## 📁 Project Structure

- `/src/app` - Next.js App Router pages
- `/src/components` - Reusable React components  
- `/src/lib` - Utility functions and Supabase client
- `/src/types` - TypeScript type definitions
- `/src/context` - React context providers

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Supabase
- **Animation**: Framer Motion

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
