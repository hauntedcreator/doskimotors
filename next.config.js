/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost', 
      'images.unsplash.com', 
      'placehold.co', 
      'res.cloudinary.com', 
      'vsa-img.copart.com', 
      'www.copart.com', 
      'www.iaai.com', 
      'www.teslarati.com',
      'i0.wp.com',
      'i1.wp.com',
      'i2.wp.com',
      'electrek.co',
      'insideevs.com',
      'cleantechnica.com',
      'cdn.motor1.com',
      'cdn.shortpixel.ai'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'vsa-img.copart.com',
      },
      {
        protocol: 'https',
        hostname: 'www.copart.com',
      },
      {
        protocol: 'https',
        hostname: 'www.iaai.com',
      },
      {
        protocol: 'https',
        hostname: 'www.teslarati.com',
      },
      {
        protocol: 'https',
        hostname: '*.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'electrek.co',
      },
      {
        protocol: 'https',
        hostname: 'insideevs.com',
      },
      {
        protocol: 'https',
        hostname: 'cleantechnica.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.motor1.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shortpixel.ai',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },
  transpilePackages: ['framer-motion', 'undici', 'cheerio', 'parse5', 'dom-serializer', 'domutils', 'domhandler', 'htmlparser2'],
  webpack: (config) => {
    // This will tell webpack to fallback to a more compatible implementation
    // when encountering problematic dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
    };
    return config;
  },
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'react-icons'],
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Disable all types of errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
}

module.exports = nextConfig 