import type { Storyline } from '@/engine/types';

export const ebankingLoginBug: Storyline = {
  id: 'ebanking-login-bug',
  title: 'E-Banking Login Bug',
  steps: [
    {
      id: 'manager-reports-bug',
      description: 'Manager messages player about the broken login',
      trigger: { type: 'manual' },
      effects: [
        {
          type: 'send_npc_message',
          npcId: 'manager',
          content:
            "Welcome aboard! Glad to have you on the team. We're excited to work with you. Ping me so we can start working on your first task.",
        },
      ],
    },
    {
      id: 'manager-intro-replied',
      description: 'Player replies to manager after receiving the onboarding message',
      trigger: { type: 'chat_message_sent', npcId: 'manager' },
      effects: [
        { type: 'unlock_npc', npcId: 'dev' },
        {
          type: 'update_npc_context',
          npcId: 'manager',
          contextKey: 'knows-player-intro-replied',
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
      ],
    },
    {
      id: 'contact-developer',
      description: 'Player reaches out to the developer for test credentials',
      trigger: { type: 'npc_chat_opened', npcId: 'dev' },
      effects: [],
    },
    {
      id: 'ask-credentials',
      description: 'Player sends any message to developer',
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
    {
      id: 'got-credentials',
      description: 'Developer responds with test username and password',
      trigger: {
        type: 'chat_message_received',
        npcId: 'dev',
        keywords: ['testuser', 'password', 'credential', 'login'],
      },
      effects: [{ type: 'complete_task', taskId: 'get-credentials' }],
    },
    {
      id: 'got-error',
      description: 'Player submits login form and sees the error code',
      trigger: {
        type: 'browser_action',
        pageId: 'lion-bank-ebanking',
        actionId: 'login-submit',
      },
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
    {
      id: 'reported-error',
      description: 'Player messages developer with the error code',
      trigger: {
        type: 'chat_message_sent',
        npcId: 'dev',
        keywords: ['ERR-LB-4012', '4012', 'error'],
      },
      conditions: [{ type: 'flag_set', flag: 'seen-error-code' }],
      effects: [
        {
          type: 'update_npc_context',
          npcId: 'dev',
          contextKey: 'knows-error-code',
        },
        { type: 'complete_task', taskId: 'report-error-code' },
      ],
    },
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
    {
      id: 'verified-fix',
      description: 'Player logs in successfully after the fix',
      trigger: {
        type: 'browser_action',
        pageId: 'lion-bank-ebanking',
        actionId: 'login-submit',
      },
      conditions: [
        {
          type: 'storyline_past_step',
          storylineId: 'ebanking-login-bug',
          stepId: 'dev-fixes-bug',
        },
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
        {
          type: 'update_npc_context',
          npcId: 'manager',
          contextKey: 'knows-fix-verified',
        },
        { type: 'complete_task', taskId: 'confirm-fix-with-dev' },
      ],
    },
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
};
