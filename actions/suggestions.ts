'use server';

import OpenAI from 'openai';
import { readSessionValid } from '@/utils/session/readSessionValid';

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
});

const SUGGESTION_PROMPT = `Given this conversation between a player and an NPC in a workplace chat:

{conversation}

The player is a junior product owner. Suggest exactly 2 short replies (max 10 words each) the player might send next. The replies should:
- Be natural and conversational
- Offer meaningfully different options (e.g., one advancing the topic, one asking for clarification)
- Match the tone of a workplace chat

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
