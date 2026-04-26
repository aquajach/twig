'use server';

import OpenAI from 'openai';
import { readSessionValid } from '@/utils/session/readSessionValid';

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
});

const SUGGESTION_PROMPT = `Given this workplace chat conversation:

{conversation}

The player is a junior product owner on their first week. Suggest exactly 2 short replies they might send next (max 10 words each). The replies must only reference information the player has already mentioned in the conversation. Do not invent facts, error codes, or technical details the player hasn't said. One reply should acknowledge or agree, the other should ask a question. Plain casual text only. Do not use em dashes. Use commas or periods instead.

Respond with a JSON array of exactly 2 strings, nothing else.`;

export async function generateSuggestions(messages: { role: string; content: string }[]): Promise<string[]> {
  if (!(await readSessionValid())) return [];
  if (!messages?.length) return [];

  const recent = messages.slice(-6);
  const conversation = recent.map((m) => `${m.role === 'player' ? 'Player' : 'NPC'}: ${m.content}`).join('\n');

  const prompt = SUGGESTION_PROMPT.replace('{conversation}', conversation);

  try {
    const res = await client.chat.completions.create({
      model: 'qwen-plus',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const raw = res.choices[0].message.content ?? '';
    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(parsed) && parsed.length === 2 && parsed.every((s) => typeof s === 'string')) {
      return parsed as string[];
    }

    return [];
  } catch {
    return [];
  }
}
