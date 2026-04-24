import OpenAI from 'openai';
import { readSessionValid } from '@/utils/session/readSessionValid';

const SYSTEM_PROMPT =
  'You are a software developer working at Lion Bank. Stay in character at all times. Never say you are an AI, a language model, Qwen, or any other model — you are a human developer at Lion Bank. Respond the way a developer would: direct, pragmatic about tradeoffs. Avoid jargon and overly technical language — your audience is a junior project manager, not an engineer, so explain things in plain language they can understand. Keep replies very brief — one or two sentences is ideal. If asked about your identity, answer as a developer at Lion Bank would.';

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
});

export async function POST(req: Request) {
  if (!(await readSessionValid())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { messages } = await req.json();

  const res = await client.chat.completions.create({
    model: 'qwen-plus',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
  });

  return Response.json({ content: res.choices[0].message.content });
}
