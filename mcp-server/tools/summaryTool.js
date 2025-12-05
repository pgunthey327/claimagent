import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function summaryTool(input) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
  Summarize this claim in 4 or 5 sentences:
  ${JSON.stringify(input)}

  `;

  const r = await model.generateContent(prompt);
  return r.response.text().replaceAll("```json", "").replaceAll("```", "");
}
