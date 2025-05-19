/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  // This is the key configuration for src directory
  distDir: '.next',
  // Tell Next.js where to find the pages
  webpack(config) {
    return config;
  },
};

// This is the most important part - it tells Next.js to use the src directory
const withSrcDirectory = (nextConfig) => {
  return {
    ...nextConfig,
    srcDir: 'src',
  };
};

module.exports = withSrcDirectory(nextConfig);
