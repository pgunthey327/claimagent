import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function extractTool(input) {
  console.log("Extracting key data for claims processing ...")
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
  Only respond in JSON format containing below fields for below prompt.

  AND

  Extract user details from input:
  - claimant_name
  - claim_type
  - description
  - vehicle_type
  - date_of_birth
  - place_of_birth 
  - vehicle_plate

  Input:
  ${JSON.stringify(input)}
  `;

  const r = await model.generateContent(prompt);
  console.log("Completed data extraction ...")
  return JSON.parse(r.response.text().replaceAll("```json", "").replaceAll("```", ""));
}
