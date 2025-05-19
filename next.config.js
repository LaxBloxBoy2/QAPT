/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'qapt-evelnvvme-anwars-projects-98548d87.vercel.app']
    }
  },
  distDir: '.next',
  // Force a clean build
  cleanDistDir: true,
  // Update the output directory
  output: 'standalone'
};

module.exports = nextConfig;
