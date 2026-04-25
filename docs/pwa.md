# PWA

The game is installed as a fullscreen standalone PWA on iPad. This eliminates the Safari chrome and makes it feel like a native app.

## Key Files

| File | Purpose |
|---|---|
| `app/manifest.ts` | Web app manifest (name, icons, display mode, orientation) |
| `app/layout.tsx` | Metadata (`appleWebApp`) and viewport config |
| `public/sw.js` | Service worker — stale-while-revalidate for static assets, network-only for `/api/*` |
| `instrumentation-client.ts` | Registers the service worker on page load |
| `app/globals.css` | iPad touch behavior overrides (no zoom, no overscroll, safe area insets) |
| `next.config.ts` | `Service-Worker-Allowed` and `Cache-Control` headers for `sw.js` |

## Cache Strategy

| Resource | Strategy |
|---|---|
| App shell (HTML, JS, CSS) | Cache-first, update in background (stale-while-revalidate) |
| Fonts (Geist) | Cache-first, long-lived |
| Icons and images | Cache-first |
| `/api/*` | Network-only (no caching) |

## Icons

Favicon files in `app/` (auto-detected by Next.js — no manual `<link>` tags needed):

| File | Output |
|---|---|
| `app/favicon.ico` | `<link rel="icon" href="/favicon.ico" sizes="any" />` |
| `app/icon.svg` | `<link rel="icon" type="image/svg+xml" ...>` |
| `app/apple-icon.png` | `<link rel="apple-touch-icon" ...>` |

PWA manifest icons in `public/` (referenced by `app/manifest.ts`):

| File | Size | Purpose |
|---|---|---|
| `web-app-manifest-192x192.png` | 192×192 | PWA maskable icon |
| `web-app-manifest-512x512.png` | 512×512 | PWA maskable icon |

## Testing PWA Install

1. Deploy to HTTPS (required for service worker)
2. Open in Safari on iPad
3. Tap Share → Add to Home Screen
4. Launch from home screen — should open fullscreen without Safari chrome
5. Verify landscape orientation is respected
6. Verify no zoom on double-tap or pinch
7. Verify no overscroll bounce
