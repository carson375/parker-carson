/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'

// Content-Security-Policy for a mostly-static portfolio site.
// External loads, verified against the codebase:
// - Images: Cloudinary (gallery/photos via lib/cloudinary.ts) + Esri map
//   tiles (server.arcgisonline.com, used by TripMap/CourseMap)
// - Media: same-origin files and Cloudinary
// - Fonts/CSS/JS: same-origin only; 'unsafe-inline' is required for
//   Next's inline bootstrap + Tailwind/MUI inline styles, and dev mode
//   additionally needs 'unsafe-eval' for the dev runtime.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://server.arcgisonline.com",
  "media-src 'self' https://res.cloudinary.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Production allows no framing at all. In dev, Home Base's Preview
  // page (same tailnet host, :8443) may frame the dev server so Parker
  // can demo phone layouts from his dashboard; nothing else may.
  `frame-ancestors ${isDev ? "'self' https://parkers-macbook.tail88a216.ts.net:8443" : "'none'"}`,
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // X-Frame-Options is the legacy framing switch; dev omits it because
  // the CSP frame-ancestors above is the (finer-grained) dev allowance.
  ...(isDev ? [] : [{ key: 'X-Frame-Options', value: 'DENY' }]),
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
]

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
