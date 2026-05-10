# Storyline DAG authoring

Use this skill when editing **`StorylineGraph`** data under `engine/storylines/`, validation, the storyline codec, or the dev **@xyflow/react** editor.

## Quick reference

- **Types:** `engine/types.ts` — `StorylineGraph`, `GraphNode`, `Trigger`, `Condition`, `StorylineRuntime`.
- **Evaluation:** `engine/evaluate.ts` — event queue, `triggeredBy`, conditions, completion rules.
- **WeTalk + LLM (`npc_message`):** When a step’s `sendMessage` → `npc_message` runs on `chat_message_sent`, the scripted line is written to the chat log during `evaluate`, **before** `ChatView` calls `/api/chat` — the model sees player → scripted NPC → and is asked for the *next* NPC reply. Chat turns use OpenAI-style roles (`player`→`user`, `npc`→`assistant` in `app/api/chat/route.ts`); if the transcript would end on `assistant`, the route appends a synthetic `user` line so the API stays valid and the model is instructed to continue the NPC voice, then cover the player’s last message if it has not already.
- **Validation:** `engine/validate.ts` — `validateGraph(graph, allStorylineIds)`; run **`npm run migrate:storylines`** after edits.
- **Disk I/O:** `engine/codec.ts` — `parseStorylineFile`, `writeStorylineFile` (expects a `const <name>: StorylineGraph = { ... }` object literal in `.ts` files).
- **Context segments (NPC prompt snippets):** Author copy per NPC in **`data/contextSegments/<npcId>.ts`** (`export const <npcId> = { 'segment-id': "..." }`). Aggregate **`data/npcSegments.ts`** composes them (`Record<NpcId, Record<string, string>>`); `data/npcs.ts` wires each NPC’s `contextSegments` from that aggregate. Codec/helpers: `engine/contextSegmentsCodec.ts`, **`engine/contextSegmentsEditor.ts`** (editor persistence + reference scan). Renaming a segment id updates every **`context` node** `contextKey` across **`engine/storylines/*.ts`** when the save matches a single-key rename with unchanged text.
- **Registry:** `engine/storylines/index.ts` — `allStorylines` array. Each graph’s **`id`** matches its **`.ts` basename** (**lowerCamelCase**, e.g. `gameStart.ts` / `id: 'gameStart'`).

## Dev editor (@xyflow/react)

- In development, open **`/storylines`** to list graphs and open one in the canvas editor (React Flow).
- **Step wiring:** triggers + conditions share **one left** target handle **`stepDeps`** (multiple edges); saving splits by source type into `triggeredBy` vs `conditions` on the step. Dependency sources (events, steps, tasks, conditions) share the same **trigger**-colored **`out`** handle; steps/tasks label it **Is complete?**. **Effects** use **right** **`stepEffects`** (effect handle color; one port, multiple edges). **`unlock_npc`** is its own node type.
- Saves **`PUT`** to `/api/editor/storylines/[id]`; responses with **`errors`** mean validation failed (fix graph or NPC ids).
- Context segments: **`GET /api/editor/context-segments`** (segment maps + storyline references per key); **`PUT /api/editor/context-segments/[npcId]`** with **`{ segments }`** writes `data/contextSegments/<npcId>.ts`, blocks deleting keys still referenced by context nodes, and auto-propagation on single-key rename (same text).
- Production builds **404** the `(editor)` routes and **403** the editor APIs.

## Rules of thumb

1. Node **ids** are map keys only; keep them stable across saves if players have persisted runtime state.
2. **`triggeredBy`** → only **`evt_*`** event block nodes, **`step`**, or **`task`** node ids.
3. **`conditions`** → only `condition` node ids.
4. Connector arrays on steps (`grantMemo`, `sendMessage`, …) must point at nodes of the **allowed** target type (see `validate.ts`).
5. Prefer **`layout`** on nodes if you use the editor so nodes stay positioned.

## NPCs

NPC ids in triggers, `npc_message`, `context`, and some conditions must exist in `data/npcs.ts`. Use **`GET /api/editor/npcs`** in dev for a quick list.
