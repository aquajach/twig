# Storylines

Storyline definitions for the game engine. Each storyline is a linear sequence of steps with triggers, conditions, and side effects. See [game-engine.md](game-engine.md) for the type system and evaluation model.

## Storyline Template

```typescript
const storyline: Storyline = {
  id: 'unique-kebab-case-id',
  title: 'Human-Readable Title',
  steps: [
    {
      id: 'step-id',
      description: 'Dev-facing description of what this step represents',
      trigger: { type: '...', /* trigger-specific fields */ },
      conditions: [
        // optional — all must pass
      ],
      effects: [
        // executed when step completes
      ],
    },
    // ... more steps
  ],
}
```

## Initial Storylines

### Game Start

A meta-storyline that fires on game load and sets up the initial state.

```typescript
const gameStart: Storyline = {
  id: 'game-start',
  title: 'Game Start',
  steps: [
    {
      id: 'init',
      description: 'Bootstrap the game world on first load',
      trigger: { type: 'game_start' },
      effects: [
        { type: 'unlock_npc', npcId: 'manager' },
        { type: 'activate_storyline', storylineId: 'ebanking-login-bug' },
      ],
    },
  ],
}
```

This storyline starts as `active` by default (the only one that does). All other storylines begin as `locked` and are activated by side effects.

---

### E-Banking Login Bug

The first real storyline. The player's manager notifies them about a broken login page. The player investigates, gets credentials from the developer, reproduces the error, reports the error code, and verifies the fix.

#### Player Flow

1. Receive WeTalk message from manager about the broken login
2. (Optional) Acknowledge manager
3. Get test credentials from developer on WeTalk
4. Open Browser, navigate to Lion Bank E-Banking
5. Attempt login, see error code
6. Report error code to developer on WeTalk
7. Developer "investigates" and "fixes" the issue
8. Player retests login — succeeds
9. Confirm fix with developer
10. Developer announces patch release

#### Definition

```typescript
const ebankingLoginBug: Storyline = {
  id: 'ebanking-login-bug',
  title: 'E-Banking Login Bug',
  steps: [
    // --- Step 0: Manager sends the initial message ---
    {
      id: 'manager-reports-bug',
      description: 'Manager messages player about the broken login',
      trigger: { type: 'manual' },
      // Fired immediately when this storyline is activated (engine auto-advances manual triggers on activation)
      effects: [
        {
          type: 'send_npc_message',
          npcId: 'manager',
          content: "Hey! Just got an urgent report — our e-banking login screen isn't working. Customers can't log in at all. Can you take a look at this? It's top priority.",
        },
        {
          type: 'show_notification',
          app: 'wetalk',
          title: 'Sarah Chen',
          body: 'Hey! Just got an urgent report...',
        },
        {
          type: 'create_task',
          task: {
            id: 'investigate-login',
            storylineId: 'ebanking-login-bug',
            title: 'Investigate the login error',
            description: 'Open the e-banking test site in the Browser and try to log in.',
          },
        },
        { type: 'unlock_npc', npcId: 'dev' },
      ],
    },

    // --- Step 1: Player opens chat with developer ---
    {
      id: 'contact-developer',
      description: 'Player reaches out to the developer for test credentials',
      trigger: { type: 'npc_chat_opened', npcId: 'dev' },
      effects: [],
    },

    // --- Step 2: Player asks developer for credentials ---
    {
      id: 'ask-credentials',
      description: 'Player sends any message to developer (asking for credentials)',
      trigger: { type: 'chat_message_sent', npcId: 'dev' },
      effects: [
        {
          type: 'update_npc_context',
          npcId: 'dev',
          contextKey: 'knows-player-needs-credentials',
        },
        {
          type: 'create_task',
          task: {
            id: 'get-credentials',
            storylineId: 'ebanking-login-bug',
            title: 'Get test credentials from developer',
            description: 'Ask the senior developer for the e-banking test login credentials.',
          },
        },
      ],
    },

    // --- Step 3: Developer provides credentials ---
    {
      id: 'got-credentials',
      description: 'Developer responds with test username and password',
      trigger: {
        type: 'chat_message_received',
        npcId: 'dev',
        keywords: ['testuser', 'password', 'credential', 'login'],
      },
      effects: [
        { type: 'complete_task', taskId: 'get-credentials' },
      ],
    },

    // --- Step 4: Player visits e-banking page ---
    {
      id: 'visit-ebanking',
      description: 'Player opens Lion Bank e-banking in the Browser',
      trigger: { type: 'browser_page_visited', pageId: 'lion-bank-ebanking' },
      effects: [],
    },

    // --- Step 5: Player attempts login and sees error ---
    {
      id: 'got-error',
      description: 'Player submits login form and sees the error code',
      trigger: { type: 'browser_action', pageId: 'lion-bank-ebanking', actionId: 'login-submit' },
      effects: [
        { type: 'set_flag', flag: 'seen-error-code' },
        {
          type: 'create_task',
          task: {
            id: 'report-error-code',
            storylineId: 'ebanking-login-bug',
            title: 'Report error code to developer',
            description: 'Tell the senior developer about the error code from the login page.',
          },
        },
        { type: 'complete_task', taskId: 'investigate-login' },
      ],
    },

    // --- Step 6: Player tells developer the error code ---
    {
      id: 'reported-error',
      description: 'Player messages developer with the error code',
      trigger: {
        type: 'chat_message_sent',
        npcId: 'dev',
        keywords: ['ERR-LB-4012', '4012', 'error'],
      },
      conditions: [
        { type: 'flag_set', flag: 'seen-error-code' },
      ],
      effects: [
        {
          type: 'update_npc_context',
          npcId: 'dev',
          contextKey: 'knows-error-code',
        },
        { type: 'complete_task', taskId: 'report-error-code' },
      ],
    },

    // --- Step 7: Developer "investigates" and "fixes" the issue ---
    {
      id: 'dev-fixes-bug',
      description: 'Developer responds confirming they found and fixed the bug',
      trigger: {
        type: 'chat_message_received',
        npcId: 'dev',
        keywords: ['fix', 'fixed', 'found', 'patch', 'deploy'],
      },
      effects: [
        {
          type: 'update_browser_page_state',
          pageId: 'lion-bank-ebanking',
          state: { loginFixed: true },
        },
        {
          type: 'create_task',
          task: {
            id: 'test-login-fix',
            storylineId: 'ebanking-login-bug',
            title: 'Verify the fix works',
            description: 'Go back to the e-banking test site and try logging in again.',
          },
        },
      ],
    },

    // --- Step 8: Player retests and login succeeds ---
    {
      id: 'verified-fix',
      description: 'Player logs in successfully after the fix',
      trigger: { type: 'browser_action', pageId: 'lion-bank-ebanking', actionId: 'login-submit' },
      conditions: [
        { type: 'storyline_past_step', storylineId: 'ebanking-login-bug', stepId: 'dev-fixes-bug' },
      ],
      effects: [
        { type: 'complete_task', taskId: 'test-login-fix' },
        {
          type: 'create_task',
          task: {
            id: 'confirm-fix-with-dev',
            storylineId: 'ebanking-login-bug',
            title: 'Confirm the fix with developer',
            description: 'Let the developer know the login is working now.',
          },
        },
      ],
    },

    // --- Step 9: Player confirms fix with developer ---
    {
      id: 'confirmed-fix',
      description: 'Player tells developer the login works',
      trigger: {
        type: 'chat_message_sent',
        npcId: 'dev',
        keywords: ['work', 'works', 'success', 'fixed', 'login', 'good', 'confirm'],
      },
      effects: [
        {
          type: 'update_npc_context',
          npcId: 'dev',
          contextKey: 'knows-fix-verified',
        },
        { type: 'complete_task', taskId: 'confirm-fix-with-dev' },
      ],
    },

    // --- Step 10: Developer announces patch release ---
    {
      id: 'patch-announced',
      description: 'Developer responds confirming they will release a patch',
      trigger: {
        type: 'chat_message_received',
        npcId: 'dev',
        keywords: ['release', 'patch', 'deploy', 'production', 'live'],
      },
      effects: [
        {
          type: 'grant_memo',
          memo: {
            id: 'first-bug-fix',
            title: 'Bug Squasher',
            description: 'Successfully triaged and verified your first production bug fix.',
          },
        },
        {
          type: 'show_notification',
          app: 'mission-center',
          title: 'Storyline Complete',
          body: 'E-Banking Login Bug resolved!',
        },
      ],
    },
  ],
}
```

#### NPC Knowledge Phases

The developer NPC's system prompt evolves through these phases:

| After Step | Context Key Added | Developer Now Knows |
|---|---|---|
| `ask-credentials` | `knows-player-needs-credentials` | Player is investigating the e-banking login. Should provide test credentials (testuser / TestPass123). |
| `reported-error` | `knows-error-code` | The error code is ERR-LB-4012. Can now "investigate the codebase" and eventually report finding the bug (an expired API token in the auth service). |
| `confirmed-fix` | `knows-fix-verified` | The fix is verified. Should announce they'll release a patch immediately. |

Before each phase, the developer does **not** have that knowledge and should respond accordingly (e.g., "What error code are you seeing?" if the player hasn't told them yet).

---

## Hidden Storyline Example (Placeholder)

Hidden storylines are not activated by `game-start`. They are discovered through player exploration — sending specific messages, visiting specific pages, or completing non-obvious actions.

```typescript
const hiddenCoffeeQuest: Storyline = {
  id: 'hidden-coffee-quest',
  title: '???',
  steps: [
    {
      id: 'mention-coffee',
      description: 'Player mentions coffee to the manager',
      trigger: {
        type: 'chat_message_sent',
        npcId: 'manager',
        keywords: ['coffee', 'cafe', 'caffeine'],
      },
      effects: [
        {
          type: 'grant_memo',
          memo: {
            id: 'coffee-lover',
            title: 'Coffee Connoisseur',
            description: 'Discovered the manager\'s secret coffee obsession.',
          },
        },
      ],
    },
  ],
}
```

**Note:** Hidden storylines need a mechanism to be `active` from the start so their triggers can fire, but remain invisible in Mission Center until discovered. One approach: a `hidden: true` flag on the storyline that suppresses it from the Tasks tab. The storyline is `active` but its tasks only appear after the first step completes.

## Adding New Storylines

1. Create a new file in `engine/storylines/` (e.g., `password-policy.ts`)
2. Define the `Storyline` object following the template above
3. Export it and add to the storyline registry
4. Define any new NPC context keys in [npc-characters.md](npc-characters.md)
5. If the storyline requires a new browser page, create a mocked page component
6. Test by playing through the storyline and verifying each step's triggers and effects fire correctly
