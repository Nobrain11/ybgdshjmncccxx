/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // serverActions is enabled by default — remove it from experimental
  experimental: {
    turbo: {
      resolveAlias: {
        '@': './src',
      },
    },
  },
};

module.exports = nextConfig;
