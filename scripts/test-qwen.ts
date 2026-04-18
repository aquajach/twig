import OpenAI from "openai";

async function main() {
  const client = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
  });

  const res = await client.chat.completions.create({
    model: "qwen-plus",
    messages: [{ role: "user", content: "請回覆：pong" }],
  });

  console.log(res.choices[0].message.content);
}

main();
