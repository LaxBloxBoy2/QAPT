/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'qapt-evelnvvme-anwars-projects-98548d87.vercel.app']
    }
  },
  distDir: '.next'
};

module.exports = nextConfig;
