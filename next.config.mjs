/** @type {import('next').NextConfig} */
import path from 'path';
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Output configuration
  output: 'standalone',
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all external images
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Experimental features
  experimental: {
    // Server Components & App Router
    appDir: true,
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    
    // Performance optimizations
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'date-fns', '@radix-ui/*'],
    
    // Webpack optimizations
    webpackBuildWorker: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.svg',
        },
      },
    },
    
    // Font optimizations
    optimizeFonts: true,
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
  
  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // SVG support
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    
    // Polyfills for Node.js modules in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: 'mock',
        child_process: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib'),
      };
    }
    
    // Performance optimizations for production
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      });
    }
    
    return config;
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  compress: true,
  
  // Security headers
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
  
  // Internationalization (i18n) - Uncomment and configure as needed
  // i18n: {
  //   locales: ['en', 'es', 'fr'],
  //   defaultLocale: 'en',
  //   localeDetection: true,
  // },
  
  // Rewrites and redirects
  async rewrites() {
    return [
      // Example rewrite
      // {
      //   source: '/api/:path*',
      //   destination: 'https://api.example.com/:path*',
      // },
    ];
  },
  
  async redirects() {
    return [
      // Example redirect
      // {
      //   source: '/old-blog/:slug',
      //   destination: '/blog/:slug',
      //   permanent: true,
      // },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
