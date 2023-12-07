/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'https://sadflower-server-3c85453c8087.herokuapp.com',
          },
        ],
      },
    }

module.exports = nextConfig
