import { ChatOpenAI } from "@langchain/openai";
const llm = new ChatOpenAI({ model: "gpt-4.1" });

export const fraudAgent = async (data) => {
  const prompt = `
Analyze the following claim:

${JSON.stringify(data)}

Give a fraud risk score (0–100) with explanation.
Return JSON.
`;

  const resp = await llm.invoke(prompt);
  return JSON.parse(resp.content);
};
