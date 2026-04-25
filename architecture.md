# Twig — Architecture

Choose-your-adventure game played on an iPad, themed as a Windows 11 / WinUI3 desktop environment. The player is a graduate/junior product owner at Lion Bank navigating workplace scenarios through in-game apps.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, react-aria-components |
| Styling | Tailwind CSS v4 (WinUI3/Fluent Design tokens) |
| State | Zustand with `persist` middleware (localStorage) |
| AI Backend | OpenAI-compatible API (Qwen via DashScope) |
| Linting | Biome |
| Auth | Session cookie with HMAC passcode |

## High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│  iPad (PWA standalone fullscreen)               │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Desktop Shell (client component)         │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Active App Window (fullscreen)     │  │  │
│  │  │                                     │  │  │
│  │  │  WeTalk | Browser | Mission Center  │  │  │
│  │  │                                     │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Taskbar (always visible)           │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

         │ fetch POST /api/chat
         ▼
┌─────────────────────┐
│  Next.js Server     │
│  /api/chat/route.ts │──▶ DashScope (Qwen)
│  Auth middleware     │
└─────────────────────┘
```

## Route Structure

| Route | Purpose |
|---|---|
| `/` | Game SPA — entire game runs here as a client-side app |
| `/login` | Passcode entry (existing) |
| `/api/chat` | AI chat proxy — accepts messages, returns NPC responses |

The game is a single-page application on `/`. All in-game navigation (switching apps, opening chats) is handled client-side through the window manager and Zustand state. No additional Next.js routes are needed for gameplay.

## Component Hierarchy

```
app/page.tsx (server component — auth gate)
└── <GameShell> (client component — 'use client')
    ├── <WindowManager>
    │   ├── <WeTalkApp>
    │   │   ├── <ContactList>
    │   │   └── <ChatView>
    │   │       ├── <MessageList>
    │   │       ├── <SuggestedReplies>
    │   │       └── <ChatInput>
    │   ├── <BrowserApp>
    │   │   ├── <BrowserToolbar>
    │   │   └── <BrowserContent>
    │   │       └── (pluggable mocked webpages)
    │   └── <MissionCenterApp>
    │       ├── <TasksTab>
    │       └── <MemosTab>
    └── <Taskbar>
        ├── <AppIcon> (WeTalk — with notification badge)
        ├── <AppIcon> (Browser)
        └── <AppIcon> (Mission Center)
```

### Reusable Components

Shared primitives built on react-aria-components live in `components/common/`. Each file has `'use client'` and is styled with Tailwind.

Examples: `Button`, `TextField`, `Tabs`, `Dialog`, `ListBox`, `Badge`.

## State Architecture

All game state is managed by Zustand stores and persisted to localStorage. The game can be closed and resumed at any time.

### Stores

| Store | Responsibility |
|---|---|
| `useWindowStore` | Which app is active, app open/minimized states |
| `useGameStore` | Storyline progress, task completion, memo collection, NPC unlock states |
| `useChatStore` | Per-NPC chat message history |

### Persistence

Zustand's `persist` middleware serializes each store to a separate localStorage key. On page load, state is rehydrated automatically.

```
localStorage keys:
  twig-window   → { activeApp: "wetalk" }
  twig-game     → { storylines: {...}, tasks: [...], memos: [...] }
  twig-chat     → { histories: { "npc-manager": [...], "npc-dev": [...] } }
```

## Game Engine

The storyline engine is a declarative system. Storylines are defined as static data, and the engine evaluates triggers against game events to advance storyline steps. See [docs/game-engine.md](docs/game-engine.md) for the full design.

Key concepts:
- **Storyline** — a named sequence of steps with a status (`locked` / `active` / `completed`)
- **Step** — an atomic stage within a storyline, advanced by triggers
- **Trigger** — an event matcher (e.g., "player sent message to NPC X containing keyword Y")
- **Condition** — a prerequisite guard checked before a trigger fires
- **Side effect** — actions executed when a step advances (unlock NPC, create task, show notification)

## AI Character System

NPC responses are generated via the `/api/chat` endpoint. Each request assembles a dynamic system prompt:

```
System prompt = Base personality
              + Role knowledge
              + Storyline-phase context (only what the NPC "knows" at this point)
```

NPCs are **not all-knowing**. Their context is gated by the current storyline state. For example, the senior developer does not know the error code until the player tells them in chat. See [docs/npc-characters.md](docs/npc-characters.md).

Suggested replies (2 per message) are generated by a separate lightweight AI call that takes the recent conversation and asks for short reply options the player might send.

## Styling

The visual theme is inspired by Windows 11 / WinUI3 / Fluent Design:

- Mica-like frosted background effects
- Rounded corners (8px for containers, 4px for controls)
- Segoe UI-inspired font stack (Geist Sans already configured)
- Subtle shadows and layering for depth
- Accent color for interactive elements
- Dark mode only (matches the game's "desktop" aesthetic)

Tailwind v4 theme tokens are defined in `app/globals.css` to match Fluent Design spacing, colors, and radii.

## PWA

The app is installed as a fullscreen standalone PWA on iPad. See [docs/pwa.md](docs/pwa.md) for file locations and cache strategy.

## File Organization

```
twig/
├── architecture.md          ← you are here
├── instrumentation-client.ts ← service worker registration
├── docs/
│   ├── game-engine.md       ← engine design & data model
│   ├── apps.md              ← app specifications
│   ├── storylines.md        ← storyline definitions
│   ├── npc-characters.md    ← character roster & knowledge gating
│   └── pwa.md               ← PWA implementation guide
├── app/
│   ├── manifest.ts          ← PWA web app manifest
│   ├── page.tsx             ← auth gate → <GameShell>
│   ├── layout.tsx           ← root layout with PWA meta
│   ├── login/page.tsx       ← passcode login
│   ├── globals.css          ← Tailwind + Fluent theme tokens
│   └── api/chat/route.ts    ← AI proxy endpoint
├── components/
│   ├── common/              ← react-aria wrappers (Button, Tabs, etc.)
│   ├── GameShell.tsx         ← desktop shell + window manager
│   ├── Taskbar.tsx
│   ├── wetalk/              ← WeTalk app components
│   ├── browser/             ← Browser app components
│   └── mission-center/      ← Mission Center components
├── stores/
│   ├── useWindowStore.ts
│   ├── useGameStore.ts
│   └── useChatStore.ts
├── engine/
│   ├── types.ts             ← Storyline, Step, Trigger, Task types
│   ├── storylines/          ← storyline definition files
│   ├── evaluate.ts          ← trigger evaluation logic
│   └── effects.ts           ← side effect handlers
└── data/
    └── npcs.ts              ← NPC definitions (personality, role, base prompts)
```
