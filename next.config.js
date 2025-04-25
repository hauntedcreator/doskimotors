/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  experimental: {
    forceSwcTransforms: false,
    swcTraceProfiling: false,
    swcPlugins: false,
    serverComponentsExternalPackages: ['@next/swc-win32-x64-msvc']
  },
  webpack: (config, { isServer }) => {
    // Force webpack to ignore @next/swc-win32-x64-msvc
    config.resolve.alias['@next/swc-win32-x64-msvc'] = false;
    return config;
  },
  compiler: {
    styledComponents: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = nextConfig 