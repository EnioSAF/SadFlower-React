const path = require('path');

const nextConfig = {
  images: {
    domains: ["sadflower-image-database.s3.eu-west-3.amazonaws.com"],
    loader: "default",
  },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};

module.exports = nextConfig;
