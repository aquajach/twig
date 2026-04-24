# PWA Implementation

The game is installed as a fullscreen standalone PWA on iPad. This eliminates the Safari chrome and makes it feel like a native app.

## Web App Manifest

Create `public/manifest.json`:

```json
{
  "name": "Twig",
  "short_name": "Twig",
  "description": "A choose-your-adventure workplace simulation game",
  "start_url": "/",
  "display": "standalone",
  "orientation": "landscape",
  "background_color": "#202020",
  "theme_color": "#202020",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

`orientation: "landscape"` encourages landscape mode on iPad, which suits the desktop simulation UI.

## HTML Meta Tags

Add to `app/layout.tsx` `<head>` (via Next.js metadata API or direct `<meta>` tags):

```html
<!-- PWA -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#202020" />

<!-- Apple-specific -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Twig" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

<!-- Viewport — prevent zoom and overscroll -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
```

### Next.js Metadata API

In `app/layout.tsx`, these can be set via the exported `metadata` object:

```typescript
export const metadata: Metadata = {
  title: 'Twig',
  description: 'A choose-your-adventure workplace simulation game',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Twig',
  },
  other: {
    'theme-color': '#202020',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}
```

## Service Worker

A minimal service worker for app shell caching. The game requires network for AI responses, so full offline support is not a goal — but caching static assets (JS, CSS, fonts, images) improves load performance and allows the shell to render immediately.

### Strategy

| Resource | Cache Strategy |
|---|---|
| App shell (HTML, JS, CSS) | Cache-first, update in background (stale-while-revalidate) |
| Fonts (Geist) | Cache-first, long-lived |
| Icons and images | Cache-first |
| `/api/chat` | Network-only (no caching) |
| Other API routes | Network-only |

### Implementation Options

1. **next-pwa** (or equivalent Next.js 16-compatible package) — wraps Workbox, generates service worker at build time
2. **Manual service worker** — `public/sw.js` with hand-written cache logic

Prefer option 1 if a maintained package exists for Next.js 16. Otherwise, a manual service worker is simple enough for this use case.

### Manual Service Worker Skeleton

`public/sw.js`:

```javascript
const CACHE_NAME = 'twig-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  // JS/CSS bundles are hashed and handled by runtime caching
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Never cache API calls
  if (url.pathname.startsWith('/api/')) {
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      return cached || fetched
    })
  )
})
```

### Service Worker Registration

Register in `app/layout.tsx` or a client component loaded on every page:

```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
```

## iPad-Specific CSS

Prevent unwanted touch behaviors in `app/globals.css`:

```css
/* Prevent text selection on game UI elements */
.game-shell {
  -webkit-user-select: none;
  user-select: none;
}

/* Allow text selection in chat input and browser input */
.game-shell input,
.game-shell textarea {
  -webkit-user-select: text;
  user-select: text;
}

/* Prevent pull-to-refresh and overscroll bounce */
html, body {
  overscroll-behavior: none;
  overflow: hidden;
  height: 100%;
}

/* Safe area insets for notched iPads */
.game-shell {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}

/* Prevent double-tap zoom */
* {
  touch-action: manipulation;
}
```

## Icons

Required icon files in `public/icons/`:

| File | Size | Purpose |
|---|---|---|
| `icon-192.png` | 192x192 | Android/generic PWA |
| `icon-512.png` | 512x512 | Android/generic PWA |
| `icon-maskable-512.png` | 512x512 | Android adaptive icon |
| `apple-touch-icon.png` | 180x180 | iOS home screen |

Icon design should reflect the game's identity — suggest a minimal "twig" or tree branch mark on the dark background color (#202020).

## next.config.ts Changes

Minimal changes needed:

```typescript
const nextConfig: NextConfig = {
  typedRoutes: true,
  // Add headers for service worker scope if needed
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'Cache-Control', value: 'no-cache' },
        ],
      },
    ]
  },
}
```

## Testing PWA Install

1. Deploy to HTTPS (required for service worker)
2. Open in Safari on iPad
3. Tap Share > Add to Home Screen
4. Launch from home screen — should open fullscreen without Safari chrome
5. Verify landscape orientation is respected
6. Verify no zoom on double-tap or pinch
7. Verify no overscroll bounce
