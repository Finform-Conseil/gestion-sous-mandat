import type { NextConfig } from 'next';

// Keep dev-runtime settings centralized so Next can reload cleanly on config changes.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    '*.trycloudflare.com',
  ],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
