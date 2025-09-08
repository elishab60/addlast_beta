import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Uncomment the following lines to ignore ESLint errors during builds
  // This allows deployment on Vercel even with linting issues
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
