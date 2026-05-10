import OpenAI from 'openai';
import { buildSystemPrompt, npcById } from '@/data/npcs';
import { readSessionValid } from '@/utils/session/readSessionValid';

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
});

type IntentDirection = 'intent_sent' | 'intent_received';
type ChatRole = 'player' | 'npc';
type ChatTurn = { role: ChatRole; content: string };

type IntentCandidate = {
  statementId: string;
  statementText: string;
};

type IntentMatch = {
  direction: IntentDirection;
  statementId: string;
  matched: boolean;
};

const INTENT_CONTEXT_TURNS = 6;
const INTENT_MAX_CANDIDATES = 8;

function normalizeCandidates(input: unknown): IntentCandidate[] {
  if (!Array.isArray(input)) return [];
  const out: IntentCandidate[] = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') continue;
    const statementId =
      typeof (item as { statementId?: unknown }).statementId === 'string'
        ? (item as { statementId: string }).statementId.trim()
        : '';
    const statementText =
      typeof (item as { statementText?: unknown }).statementText === 'string'
        ? (item as { statementText: string }).statementText.trim()
        : '';
    if (!statementId || !statementText) continue;
    out.push({ statementId, statementText });
    if (out.length >= INTENT_MAX_CANDIDATES) break;
  }
  return out;
}

function parseIntentResult(jsonText: string, direction: IntentDirection): IntentMatch[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((item): item is { statementId: string; matched: boolean } => {
      if (!item || typeof item !== 'object') return false;
      if (typeof (item as { statementId?: unknown }).statementId !== 'string') return false;
      if (typeof (item as { matched?: unknown }).matched !== 'boolean') return false;
      return true;
    })
    .map((item) => ({
      direction,
      statementId: item.statementId,
      matched: item.matched,
    }));
}

async function classifyIntentMatches(args: {
  direction: IntentDirection;
  utterance: string;
  messages: ChatTurn[];
  candidates: IntentCandidate[];
}): Promise<IntentMatch[]> {
  if (!args.utterance.trim() || args.candidates.length === 0) return [];
  const recent = args.messages.slice(-INTENT_CONTEXT_TURNS);
  const contextText = recent.map((m) => `${m.role}: ${m.content}`).join('\n');
  const candidateText = args.candidates
    .map((c) => `- statementId: ${c.statementId}\n  statementText: ${c.statementText}`)
    .join('\n');
  const prompt = [
    'Classify whether each statement is true for the target utterance.',
    `direction: ${args.direction}`,
    `target_utterance: ${args.utterance}`,
    `recent_context:\n${contextText}`,
    `statements:\n${candidateText}`,
    'Return JSON array only with shape: [{"statementId":"...","matched":true|false}]',
  ].join('\n\n');

  const response = await client.chat.completions.create({
    model: 'qwen-plus',
    temperature: 0,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'intent_matches',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              statementId: { type: 'string' },
              matched: { type: 'boolean' },
            },
            required: ['statementId', 'matched'],
          },
        },
      },
    },
    messages: [
      {
        role: 'system',
        content:
          'You are a strict JSON intent classifier. Respond with JSON only, no markdown, no prose, no extra keys.',
      },
      { role: 'user', content: prompt },
    ],
  });
  const content = response.choices[0]?.message?.content ?? '[]';
  return parseIntentResult(content, args.direction);
}

export async function POST(req: Request) {
  if (!(await readSessionValid())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { npcId, messages, contextKeys, intentCandidates } = (await req.json()) as {
    npcId?: unknown;
    messages?: unknown;
    contextKeys?: unknown;
    intentCandidates?: unknown;
  };

  const npc = npcById(typeof npcId === 'string' ? npcId : '');
  if (!npc) {
    return Response.json({ error: 'Unknown NPC' }, { status: 400 });
  }

  const chatMessages: ChatTurn[] = Array.isArray(messages)
    ? messages
        .filter(
          (m): m is { role: unknown; content: unknown } =>
            !!m && typeof m === 'object' && 'role' in m && 'content' in m,
        )
        .map((m) => ({
          role: m.role === 'player' ? 'player' : 'npc',
          content: typeof m.content === 'string' ? m.content : '',
        }))
    : [];
  const safeContextKeys =
    Array.isArray(contextKeys) && contextKeys.every((k) => typeof k === 'string') ? contextKeys : [];

  const systemPrompt = buildSystemPrompt(npc, safeContextKeys);

  const completionMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...chatMessages.map((m) => {
      const role: 'user' | 'assistant' = m.role === 'player' ? 'user' : 'assistant';
      return { role, content: m.content };
    }),
  ];

  if (completionMessages.length > 0 && completionMessages.at(-1)?.role === 'assistant') {
    completionMessages.push({
      role: 'user' as const,
      content: "<Continue where you last left off, only then address my last message if you haven't already>",
    });
  }

  console.log('[chat] request', { npcId: npc.id, messages: completionMessages });

  const res = await client.chat.completions.create({
    model: 'qwen-plus',
    messages: completionMessages,
  });
  const content = res.choices[0].message.content ?? '';

  const sentCandidates = normalizeCandidates((intentCandidates as { sent?: unknown } | undefined)?.sent);
  const receivedCandidates = normalizeCandidates((intentCandidates as { received?: unknown } | undefined)?.received);
  const intentMatches: IntentMatch[] = [];

  if (sentCandidates.length > 0 || receivedCandidates.length > 0) {
    const classificationCache = new Map<string, IntentMatch[]>();
    const lastPlayerUtterance =
      [...chatMessages].reverse().find((m) => m.role === 'player' && typeof m.content === 'string')?.content ?? '';

    const classifyCached = async (direction: IntentDirection, utterance: string, candidates: IntentCandidate[]) => {
      if (!utterance.trim() || candidates.length === 0) return [];
      const key = `${direction}:${utterance}:${candidates.map((c) => c.statementId).join('|')}`;
      const cached = classificationCache.get(key);
      if (cached) return cached;
      try {
        const result = await classifyIntentMatches({
          direction,
          utterance,
          messages: chatMessages,
          candidates,
        });
        classificationCache.set(key, result);
        return result;
      } catch {
        return [];
      }
    };

    intentMatches.push(...(await classifyCached('intent_sent', lastPlayerUtterance, sentCandidates)));
    intentMatches.push(...(await classifyCached('intent_received', content, receivedCandidates)));

    const candidateStatementById = new Map(
      [...sentCandidates, ...receivedCandidates].map((c) => [c.statementId, c.statementText] as const),
    );
    console.log('[intent] matches', {
      npcId: npc.id,
      lastSentLine: lastPlayerUtterance,
      lastReceivedLine: content,
      intentMatches: intentMatches.map((m) => ({
        ...m,
        statementText: candidateStatementById.get(m.statementId) ?? '',
      })),
    });
  }

  return Response.json({ content, intentMatches });
}
