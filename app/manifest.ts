import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PO Simulator',
    short_name: 'PO Sim',
    start_url: '/',
    display: 'standalone',
    orientation: 'landscape',
    background_color: '#EFE9E0',
    theme_color: '#EFE9E0',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
