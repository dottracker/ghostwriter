import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // This applies these headers to all routes in your application
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Prevents your site from being put in an <iframe> (Clickjacking protection)
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevents the browser from "guessing" the content type
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin', // Protects privacy when clicking links
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              // Allow scripts from your own site and Vercel/Next.js internal scripts
              "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
              // Allow styles from your site, Google Fonts, and inline (Tailwind needs this)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              // Allow fonts from Google Fonts
              "font-src 'self' https://fonts.gstatic.com;",
              // Allow images from your site and the paper texture we used
              "img-src 'self' data: blob: https://www.transparenttextures.com;",
              // IMPORTANT: Allow connections to Supabase and Upstash Redis
              "connect-src 'self' https://*.supabase.co https://*.upstash.io;",
              "frame-ancestors 'none';",
            ].join(' '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
