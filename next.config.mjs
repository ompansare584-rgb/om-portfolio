/**
 * Stability first. Nothing exotic here: static output, safe headers, long caching for
 * images, and one rewrite that gives AI agents clean markdown (see src/lib/llms.ts).
 * A strict Content-Security-Policy is deliberately NOT set: it can break Next.js inline
 * scripts and the Web Audio / WebGL code. Add one later with nonces if you want it.
 */
const withAnalyzer = process.env.ANALYZE
  ? (await import('@next/bundle-analyzer')).default({ enabled: true })
  : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Stability: a lint or type warning must never stop a deploy of a portfolio. Run `npm run check` yourself before pushing.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 828, 1080, 1440],
    imageSizes: [96, 160, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'gsap', 'three'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
      {
        source: '/(images|textures|audio)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async rewrites() {
    // AI agents that send "Accept: text/markdown" get the clean markdown version of a page.
    const md = [
      ['/', '/llms-full.txt'],
      ['/hiring', '/md/hiring'],
      ['/editing', '/md/editing'],
      ['/ragas', '/md/ragas'],
    ];
    return {
      beforeFiles: md.map(([source, destination]) => ({
        source,
        has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
        destination,
      })),
    };
  },
};

export default withAnalyzer(nextConfig);
