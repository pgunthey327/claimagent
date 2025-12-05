import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function fraudCheckTool(input) {
  console.log("Checking for fraud possibility ...")
 const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
 
   const prompt = `
    Analyise user datails in below input and tell in 1 or 2 lines if fraud possibility is there or no

    Input:
   ${JSON.stringify(input)}
   `;
 
   const r = await model.generateContent(prompt);
   console.log("Fraud check completed ...")
   return r.response.text();
}
