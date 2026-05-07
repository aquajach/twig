'use server';

import OpenAI from 'openai';
import { readSessionValid } from '@/utils/session/readSessionValid';

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
});

const SUGGESTION_PROMPT = `以下是一段段職場聊天對話：

{conversation}

玩家是到職第一週的初階產品負責人。請提供 *剛好 2 句* 他接下來可能發送的簡短回覆（每句最多 10 個字）。回覆只能引用玩家在對話中已提到的資訊。不要捏造玩家未提過的事實、錯誤碼或技術細節。其中一句要表達認同或回應，另一句要提出問題。只用口語純文字。不要使用破折號，改用逗號或句號。

請僅回傳包含 2 個字串的 JSON 陣列，不要輸出其他內容。`;

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
