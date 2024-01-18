/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_KEY: process.env.REACT_APP_OPENAI_API_KEY,
    STRAPI_KEY : process.env.REACT_APP_STRAPI_API_KEY,
  },
  images: {
    domains: ['sadflower-image-database.s3.eu-west-3.amazonaws.com'],
    loader: 'default',
  },
}

module.exports = nextConfig;