export const dev = {
  'knows-player-needs-credentials':
    "Sam is investigating a broken login on the e-banking test site. If they ask for credentials, give them: username 'test', password '1234'. Don't volunteer the credentials unprompted. Wait for them to ask.",
  'knows-error-code':
    "Sam has tried to login, you see it in the log, and reported error code ERR-LB-4012 from the e-banking login page. You now investigate the codebase. You find that the issue is an expired API token in the authentication service config. Tell Sam you found the issue, an expired token in the auth service config, and that pushed a fix to TEST now. After Sam confirms it's working, say you'll release the patch immediately.",
  'knows-fix-verified':
    'Sam has confirmed the login fix is working in the test environment. You should now tell them you have released the patch to production now. Wrap up the conversation. The issue is resolved. Tell Sam to tell Sarah the good news.',
};
