/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'wowmsuvnokexqyuksweh.supabase.co',
      'images.unsplash.com',
      'plus.unsplash.com',
      'source.unsplash.com'
    ],
  },
  // Add security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
