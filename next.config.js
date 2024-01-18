/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_KEY: process.env.REACT_APP_OPENAI_API_KEY,
    STRAPI_KEY : process.env.REACT_APP_STRAPI_API_KEY,
  },
  images: {
    domains: ['sadflower-server-3c85453c8087.herokuapp.com'],
    loader: 'default', // Utilise le loader par défaut pour le mode local
    path: 'https://www.sadflower.fr/_next/image', // Définit le path pour le mode production
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sadflower-server-3c85453c8087.herokuapp.com',
      },
    ],
  },
}

module.exports = nextConfig