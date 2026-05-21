/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  /* Instant page loads — aggressive static generation */
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimisticClientCache: true,
  },
};

export default nextConfig;
