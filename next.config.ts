import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/blog',
  // Allow server actions and SSR to trust the custom domain behind the proxy
  experimental: {
    serverActions: {
      allowedOrigins: ['bdsmbrazil.com.br'],
    },
  },
};

export default nextConfig;
