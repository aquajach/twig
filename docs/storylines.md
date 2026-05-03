# Storylines (DAG graphs)

Each storyline is a **`StorylineGraph`**: metadata plus a **`nodes`** map of typed **`GraphNode`** values. Node ids are **only** the map keys (nodes do not carry an `id` field). See [`engine/types.ts`](../engine/types.ts) and [`docs/game-engine.md`](game-engine.md) for triggers, conditions, side effects, and runtime.

## Shape

```typescript
import type { StorylineGraph } from '@/engine/types';

export const myStoryline: StorylineGraph = {
  id: 'my-storyline',
  title: 'My Storyline',
  initialStatus: 'locked', // optional; default runtime rules still apply
  introCard: { label: '…' }, // optional
  nodes: {
    'some-step': {
      type: 'step',
      description: '…',
      triggeredBy: ['evt-chat'], // event-block / step / task node ids
      conditions: ['cond-flag'], // condition node ids (optional)
      sendMessage: ['nm-welcome'], // npc_message node ids, etc.
      // …other optional connector arrays (see StepNode in types)
      layout: { x: 0, y: 0 }, // optional; used by dev editor
    },
    'evt-chat': {
      type: 'evt_chat_message_sent',
      npcId: 'manager',
      keywords: ['hi'],
    },
    // …
  },
};
```

### Node kinds

| `type`           | Role |
|------------------|------|
| `step`           | Fires when every `triggeredBy` ref is satisfied, every `conditions` node passes, then runs connector side effects (tasks, memos, messages, …). |
| `evt_*`          | Event blocks: one `type` per trigger variant (e.g. `evt_chat_message_sent`, `evt_browser_action`). Satisfied when that trigger matches a `GameEvent`. |
| `condition`      | Boolean `condition` evaluated against game state. |
| `task`           | Holds `task` definition; referenced by steps (`createTask` / `completeTask`). |
| `context`        | NPC context segment; referenced by `unlockContext`. |
| `memo`           | Memo definition; referenced by `grantMemo`. |
| `notification`   | In-app notification payload; referenced by `notify`. |
| `npc_message`    | DM content; referenced by `sendMessage`. |
| `browser_state`  | Page + `set` / `update` + optional `state`; referenced by `setPage` / `updatePageState`. |
| `storyline_ref`  | Target storyline id; referenced by `activateStoryline`. |

**`triggeredBy`** may only reference nodes of type `event`, `step`, or `task`. **`conditions`** only `condition` nodes. Other step arrays must reference the matching node types (enforced by [`engine/validate.ts`](../engine/validate.ts)).

## Files and registry

1. Add `engine/storylines/<id>.ts` where **`StorylineGraph.id`** and the file basename (without `.ts`) are the same **lowerCamelCase** string (for example `gameStart.ts` with `id: 'gameStart'`). The exported `const` name comes from [`fileBaseToExportName`](../engine/codec.ts) on that basename (unchanged for typical ids).
2. Import it in [`engine/storylines/index.ts`](../engine/storylines/index.ts) and append to **`allStorylines`**.
3. Run **`npm run migrate:storylines`** (validates every graph file against the registry).
4. Optional: use the **dev-only** visual editor at **`/storylines`** ([**@xyflow/react**](https://reactflow.dev/)); saves go through **`PUT /api/editor/storylines/[id]`** and rewrite the TS file via [`engine/codec.ts`](../engine/codec.ts).

## Dev editor & API

- **UI:** `/storylines` (list) and `/storylines/[storylineId]` — disabled in production (`layout` calls `notFound()`).
- **Wiring:** **Triggers & conditions:** from a dependency's **`out`** (trigger handle color, labeled **Is complete?** on steps/tasks) into the step's **single left** target **`stepDeps`**; multiple edges are allowed. On save, wires from **`condition`** nodes become **`conditions`**, everything else becomes **`triggeredBy`**. **Effects:** from the step's **right** source **`stepEffects`** (effect handle color, multiple edges) into side-effect nodes' unnamed **left** target or a **task**'s **create** / **complete**. **`unlock_npc`** is its own node type. The adapter maps topology to step arrays (`triggeredBy`, `grantMemo`, …).
- **API:** `GET/POST /api/editor/storylines`, `GET/PUT /api/editor/storylines/[storylineId]`, `GET /api/editor/npcs` — **403** when `NODE_ENV === 'production'`.

## Authoring tips

- Keep **event keywords** tight so unrelated chat lines do not satisfy the wrong event.
- **`browser_action`** events repeat on the same action id: the engine may clear satisfaction for specific steps/storylines so the same action can fire again (see e-banking storyline).
- **Completion:** a storyline completes when **all task nodes** are completed **and** **all step nodes** have fired (so late steps like memos/notifications still run).

## Examples in repo

- [`engine/storylines/gameStart.ts`](../engine/storylines/gameStart.ts) — bootstrap + manager handoff.
- [`engine/storylines/ebankingLoginBug.ts`](../engine/storylines/ebankingLoginBug.ts) — full DAG for the first mission.
- [`engine/storylines/hiddenCoffeeQuest.ts`](../engine/storylines/hiddenCoffeeQuest.ts) — small event + memo graph.

Older linear `Storyline` / `StorylineStep` docs are obsolete; everything is graph-based now.
