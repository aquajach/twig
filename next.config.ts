import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  allowedDevOrigins: ['192.168.2.1'],
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
