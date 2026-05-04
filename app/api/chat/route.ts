import OpenAI from 'openai';
import { buildSystemPrompt, npcById } from '@/data/npcs';
import { readSessionValid } from '@/utils/session/readSessionValid';

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
});

export async function POST(req: Request) {
  if (!(await readSessionValid())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { npcId, messages, contextKeys } = await req.json();

  const npc = npcById(typeof npcId === 'string' ? npcId : '');
  if (!npc) {
    return Response.json({ error: 'Unknown NPC' }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(npc, contextKeys ?? []);

  const res = await client.chat.completions.create({
    model: 'qwen-plus',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'player' ? 'user' : 'assistant',
        content: m.content,
      })),
    ],
  });

  return Response.json({ content: res.choices[0].message.content });
}
