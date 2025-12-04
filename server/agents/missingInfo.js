import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({ model: "gpt-4.1" });

export const missingInfoAgent = async (extractedText) => {
  const prompt = `
Extracted claim text:
${extractedText}

Identify missing mandatory insurance claim fields.
Fields: Name, Policy Number, Incident Date, Description, Vehicle VIN.

Return in JSON.
  `;

  const response = await llm.invoke(prompt);
  return JSON.parse(response.content);
};
