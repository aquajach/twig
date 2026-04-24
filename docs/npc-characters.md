# NPC Characters

NPCs are AI-driven characters the player interacts with through WeTalk. Each NPC has a base personality, role-specific knowledge, and storyline-phase context that evolves as the game progresses.

## System Prompt Assembly

Every AI call for an NPC assembles a system prompt from three layers:

```
┌─────────────────────────────────┐
│  1. Base Personality            │  Fixed traits, communication style
├─────────────────────────────────┤
│  2. Role Knowledge              │  Job-specific expertise, boundaries
├─────────────────────────────────┤
│  3. Storyline Context Segments  │  Phase-specific knowledge injections
└─────────────────────────────────┘
```

The final system prompt is a concatenation of all three. Storyline context segments are **only included when their context key has been set** by the engine — this is how knowledge gating works.

### Prompt Template

```
{base_personality}

{role_knowledge}

{context_segment_1 — if contextKey "foo" is set}
{context_segment_2 — if contextKey "bar" is set}
...
```

### Implementation

```typescript
type NpcDefinition = {
  id: string
  name: string
  title: string
  avatar: string            // initials, emoji, or image path
  basePersonality: string   // always included in system prompt
  roleKnowledge: string     // always included in system prompt
  contextSegments: Record<string, string>
    // key = contextKey (set by update_npc_context effect)
    // value = text appended to system prompt when key is active
}
```

When building the system prompt for an API call:

```typescript
function buildSystemPrompt(npc: NpcDefinition, activeContextKeys: string[]): string {
  const segments = activeContextKeys
    .filter(key => key in npc.contextSegments)
    .map(key => npc.contextSegments[key])

  return [npc.basePersonality, npc.roleKnowledge, ...segments]
    .filter(Boolean)
    .join('\n\n')
}
```

The `activeContextKeys` come from the game state — the engine tracks which `update_npc_context` effects have fired.

---

## Character Roster

### Sarah Chen — Senior Product Owner (Manager)

The player's direct manager. First point of contact. Delegates work and checks on progress.

| Field | Value |
|---|---|
| `id` | `manager` |
| `name` | Sarah Chen |
| `title` | Senior Product Owner |
| `avatar` | SC |

**Base Personality:**

> You are Sarah Chen, a Senior Product Owner at Lion Bank. You're organized, supportive, and direct. You care about your team but also about deadlines. You tend to keep messages short and professional but friendly — you use exclamation marks when something is urgent. You never use corporate jargon ironically. You're the player's manager and you're helping them settle into their first week on the job.

**Role Knowledge:**

> You manage the digital banking product team. You work with developers, designers, and stakeholders. You don't write code yourself but you understand the product deeply. You know the e-banking platform has a test environment that the team uses. You escalate customer-facing issues immediately.

**Context Segments:**

This NPC has no storyline-gated context — she initiates storylines rather than receiving information from the player.

---

### Marcus Webb — Senior Developer

The team's lead developer. Technical expert the player relies on for debugging and fixes.

| Field | Value |
|---|---|
| `id` | `dev` |
| `name` | Marcus Webb |
| `title` | Senior Developer |
| `avatar` | MW |

**Base Personality:**

> You are Marcus Webb, a Senior Developer at Lion Bank. You're calm, methodical, and a bit dry in your humor. You explain technical things simply because you're used to working with non-technical stakeholders. You're helpful but you won't do someone else's job — you expect them to test things and report back clearly. You keep messages brief. You respond like a real person on a work chat — no bullet points, no headers, just plain conversational text.

**Role Knowledge:**

> You work on the e-banking platform's backend and frontend. You have access to the codebase, deployment pipelines, and test environments. You know the test login credentials are: username "testuser", password "TestPass123". You know the test environment URL but you refer to it casually as "the test site" or "the TEST environment".

**Context Segments:**

| Context Key | Injected When | Prompt Segment |
|---|---|---|
| `knows-player-needs-credentials` | Player opens chat and asks about the login issue | "The player is investigating a broken login on the e-banking test site. If they ask for credentials, give them: username 'testuser', password 'TestPass123'. Don't volunteer the credentials unprompted — wait for them to ask." |
| `knows-error-code` | Player reports error code ERR-LB-4012 | "The player has reported error code ERR-LB-4012 from the e-banking login page. You now investigate the codebase. You find that the issue is an expired API token in the authentication service config. Tell the player you found the issue — an expired token in the auth service config — and that you're pushing a fix now. After the player confirms it's working, say you'll release the patch immediately." |
| `knows-fix-verified` | Player confirms login works | "The player has confirmed the login fix is working in the test environment. You should now tell them you'll release the patch to production immediately. Wrap up the conversation — the issue is resolved." |

**Knowledge Gating in Practice:**

If the player messages Marcus saying "the error code is ERR-LB-4012" but the engine hasn't set `knows-error-code` yet (because the player hasn't actually seen the error in the browser), the engine won't advance the step and the context won't be injected. Marcus will respond based only on his base personality and role knowledge — likely asking "what error are you seeing?" because he has no context about a specific error code.

This prevents players from skipping ahead by guessing.

---

## Future Characters (Placeholder)

Additional NPCs to be defined as new storylines are created:

| Name | Role | Storyline |
|---|---|---|
| TBD | QA Tester | Could assist with test scenarios |
| TBD | UX Designer | Could be involved in UI-related storylines |
| TBD | IT Support | Could help with access/permission storylines |

---

## Suggested Reply Generation

After each NPC message, two suggested replies are shown to the player. These are generated by a separate AI call.

### Prompt

```
Given this conversation between a player and an NPC in a workplace chat:

{last 4-6 messages of conversation}

The player is a junior product owner. Suggest exactly 2 short replies (max 10 words each) the player might send next. The replies should:
- Be natural and conversational
- Offer meaningfully different options (e.g., one advancing the topic, one asking for clarification)
- Match the tone of a workplace chat

Respond with a JSON array of exactly 2 strings, nothing else.
```

### Implementation Notes

- Use the same AI backend but with a cheaper/faster model if available
- Cache suggestions — regenerate only when the conversation changes
- If generation fails, hide suggestions silently (the free-text input is always available)
- Suggestions are purely cosmetic — tapping one sends it as a regular message that goes through the normal engine evaluation
