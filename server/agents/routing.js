import { ChatOpenAI } from "@langchain/openai";
const llm = new ChatOpenAI({ model: "gpt-4.1" });

export const routingAgent = async (data) => {
  const prompt = `
Based on this claim:
${JSON.stringify(data)}

Assign a routing queue:
- Express
- Moderate
- Major Loss

Return JSON.
`;

  const resp = await llm.invoke(prompt);
  return JSON.parse(resp.content);
};
