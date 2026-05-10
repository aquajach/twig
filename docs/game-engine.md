# Game Engine

The game engine is a declarative storyline progression system. Storylines are defined as static data. At runtime, the engine listens for game events, evaluates triggers, and advances storyline steps when conditions are met.

## Core Concepts

| Concept | Description |
|---|---|
| **Storyline** | A named narrative arc with ordered steps. Has a status: `locked`, `active`, or `completed`. |
| **Step** | An atomic stage within a storyline. The engine tracks the current step index per storyline. |
| **Trigger** | A pattern that matches a game event. When matched (and conditions pass), the current step advances. |
| **Condition** | A prerequisite check evaluated before a trigger fires. Prevents premature progression. |
| **Side Effect** | Actions executed when a step advances: unlock NPC, create task, show notification, change browser state, grant memo. |
| **Task** | A player-visible objective tied to a storyline. Discovered when the engine reveals it. |
| **Memo** | An achievement or collectable granted as a side effect. |

## Data Model

### Storyline

```typescript
type StorylineStatus = 'locked' | 'active' | 'completed'

type Storyline = {
  id: string
  title: string
  steps: StorylineStep[]
}
```

### StorylineStep

```typescript
type StorylineStep = {
  id: string
  description: string              // internal description for dev reference
  trigger: Trigger
  conditions?: Condition[]         // all must pass for trigger to fire
  effects: SideEffect[]            // executed when this step completes
}
```

### Trigger

Triggers match against game events. Each trigger has a `type` and type-specific fields.

```typescript
type Trigger =
  | { type: 'game_start' }
  | { type: 'chat_message_sent'; npcId: string; keywords?: string[] }
  | { type: 'chat_message_received'; npcId: string; keywords?: string[] }
  | { type: 'npc_chat_opened'; npcId: string }
  | { type: 'browser_page_visited'; pageId: string }
  | { type: 'browser_action'; pageId: string; actionId: string }
  | { type: 'task_completed'; taskId: string }
  | { type: 'storyline_completed'; storylineId: string }
  | { type: 'manual' }  // advanced by engine call, not player event
```

**`keywords`** — when present, at least one keyword must appear in the message content (case-insensitive substring match). When absent, any message to/from the NPC matches.

### Condition

Conditions are guards checked before a trigger can fire.

```typescript
type Condition =
  | { type: 'storyline_status'; storylineId: string; status: StorylineStatus }
  | { type: 'storyline_at_step'; storylineId: string; stepId: string }
  | { type: 'task_status'; taskId: string; status: TaskStatus }
  | { type: 'npc_unlocked'; npcId: string }
```

### Side Effect

Side effects mutate game state when a step completes.

```typescript
type SideEffect =
  | { type: 'unlock_npc'; npcId: string }
  | { type: 'unlock_browser_page'; pageId: string }
  | { type: 'send_npc_message'; npcId: string; content: string }
  | { type: 'show_notification'; app: AppId; title: string; body?: string }
  | { type: 'create_task'; task: TaskDefinition }
  | { type: 'complete_task'; taskId: string }
  | { type: 'grant_memo'; memo: MemoDefinition }
  | { type: 'set_browser_page'; pageId: string }
  | { type: 'update_browser_page_state'; pageId: string; state: Record<string, unknown> }
  | { type: 'activate_storyline'; storylineId: string }
  | { type: 'update_npc_context'; npcId: string; contextKey: string }
```

### Task

```typescript
type TaskStatus = 'hidden' | 'active' | 'completed'

type TaskDefinition = {
  id: string
  storylineId: string
  title: string
  description: string
}
```

### Memo

```typescript
type MemoDefinition = {
  id: string
  title: string
  description: string
  icon?: string
}
```

### AppId

```typescript
type AppId = 'wetalk' | 'browser' | 'mission-center'
```

## Game State

The runtime game state tracked by `useGameStore`:

```typescript
type GameState = {
  storylines: Record<string, StorylineRuntime>
  tasks: Record<string, TaskStatus>
  memos: string[]              // collected memo IDs
  unlockedNpcs: string[]
}

type StorylineRuntime = {
  status: StorylineStatus
  currentStepIndex: number     // index into the storyline's steps array
}
```

## State Transitions

```
┌────────┐   activate_storyline   ┌────────┐
│ locked │ ──────────────────────▶ │ active │
└────────┘                        └───┬────┘
                                      │
                          trigger matched + conditions pass
                                      │
                                      ▼
                               advance step index
                                      │
                          ┌───────────┴───────────┐
                          │                       │
                    more steps?              last step?
                          │                       │
                          ▼                       ▼
                    stay active            ┌───────────┐
                                           │ completed │
                                           └───────────┘
```

## Event Flow

When a game event occurs (e.g., player sends a chat message):

1. The originating component dispatches the event to the engine.
2. The engine iterates all `active` storylines.
3. For each, it checks if the current step's trigger matches the event.
4. If matched, it evaluates all conditions. If any condition fails, the trigger is skipped.
5. If all conditions pass, the step is marked complete and its side effects are executed.
6. The storyline advances to the next step (or completes if it was the last).
7. Side effects may cascade — e.g., `activate_storyline` on another storyline, which may itself have a `game_start`-like trigger that fires immediately.

```
Component (e.g. ChatView)
    │
    │  dispatch({ type: 'chat_message_sent', npcId: 'dev', content: '...' })
    ▼
Engine.evaluate(event)
    │
    ├─▶ storyline "ebankingLoginBug" (active, step 4)
    │     trigger: { type: 'chat_message_sent', npcId: 'dev', keywords: ['ERR-401'] }
    │     triggeredBy: chat event + prior step `got-error` already fired
    │     → all deps satisfied ✓
    │     → execute effects → advance to step 5
    │
    ├─▶ storyline "hiddenCoffeeQuest" (active, step 0)
    │     trigger: { type: 'chat_message_sent', npcId: 'manager', keywords: ['coffee'] }
    │     → trigger does not match (wrong NPC) ✗
    │
    └─▶ storyline "onboarding" (completed) — skipped
```

## localStorage Schema

Persisted via Zustand `persist` middleware under key `twig-game`:

```json
{
  "state": {
    "storylines": {
      "ebankingLoginBug": { "status": "active", "currentStepIndex": 3 },
      "onboarding": { "status": "completed", "currentStepIndex": 2 }
    },
    "tasks": {
      "investigate-login": "completed",
      "test-login-fix": "active",
      "hidden-easter-egg": "hidden"
    },
    "memos": ["first-day-badge"],
    "unlockedNpcs": ["manager", "dev"],
    "unlockedBrowserPages": ["lion-bank-ebanking"]
  },
  "version": 3
}
```

## Defining New Storylines

Storylines are defined as plain objects conforming to the `Storyline` type. They live in `engine/storylines/` as separate files, one per storyline. The engine imports all storyline definitions at startup.

See [storylines.md](storylines.md) for the template and worked examples.

## Design Constraints

- **No async triggers.** Trigger evaluation is synchronous. AI responses are handled by the chat system dispatching a `chat_message_received` event after the response arrives.
- **Step ordering is linear.** Each storyline progresses through its steps array in order. Branching narratives are modeled as separate storylines activated via `activate_storyline` side effects.
- **Idempotent evaluation.** Re-evaluating the same event against the same state produces the same result. Side effects are only applied once per step advancement.
- **Cross-storyline gates.** Use `storyline_status`, `storyline_at_step`, or `task_status` on a `condition` node, or activate a separate storyline whose steps encode the dependency.
- **Same-storyline “step already fired”.** List that step’s id in the dependent step’s `triggeredBy` (a fires→ / stepDeps wire in the editor). There is no separate “past step” condition type, and no global string flags in game state.
