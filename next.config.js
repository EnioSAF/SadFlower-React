const path = require('path');

const nextConfig = {
  env: {
    OPENAI_KEY: process.env.REACT_APP_OPENAI_API_KEY,
    STRAPI_KEY: process.env.REACT_APP_STRAPI_API_KEY,
  },
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
