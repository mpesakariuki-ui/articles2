/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ui-avatars.com', 'placehold.co', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['firebase-admin'],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    typedRoutes: false,
  },
}

module.exports = nextConfig