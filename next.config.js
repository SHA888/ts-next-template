/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  experimental: {
    // appDir is now stable in Next.js 14
    // Removed appDir as it's no longer needed in the experimental config
  },
  images: {
    domains: ['localhost'],
  },
  // Disable webpack's dev middleware for better extension compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Disable source maps in development to prevent extension conflicts
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
