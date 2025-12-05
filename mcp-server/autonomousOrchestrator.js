import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { initializeRAG, queryRAG } from "./rag.js";
import extractTool from "./tools/extractTool.js";
import validateTool from "./tools/validateTool.js";
import summaryTool from "./tools/summaryTool.js";
import fraudCheckTool from "./tools/fraudCheckTool.js";

// Initialize MCP server
const mcp = new McpServer({ name: "ClaimAI-Autonomous" });

// Register all tools
mcp.registerTool("extract_claim_fields",{}, extractTool);
mcp.registerTool("validate_claim",{}, validateTool);
mcp.registerTool("summarize_claim",{}, summaryTool);
mcp.registerTool("fraud_check",{}, fraudCheckTool);
// mcp.registerTool("save_to_db",{}, saveToDBTool);

// await new Promise(resolve => setTimeout(resolve, 50));


// Helper: check if a tool is registered
function isToolRegistered(toolName) {
  // MCP exposes registered tools via `mcp._tools` (or `mcp.tools` in some versions)
  return Object.keys(mcp._registeredTools).includes(toolName);
}
process.env.GEMINI_API_KEY = "AIzaSyAfEXzT43TxhWGp0C6UJ3A4N3WNDeRsyn4";
export default async function autonomousAgent(userText) {

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Initialize RAG
  console.log("Initializing RAG...");
  await initializeRAG();
  console.log("RAG ready.");

  // ───────────────────────────────────────────────
  // Enrich user text using RAG
  // ───────────────────────────────────────────────
  const enrichedText = await queryRAG(userText);

  let context = { results: {}, enrichedText };
  let steps = 0;
  const maxSteps = 5;

  // List of tools and descriptions for LLM
let toolDescriptions = {
  extract_claim_fields: { name: "extract_claim_fields", description: "Extract structured fields from claim text"},
  validate_claim: { name: "validate_claim", description: "Validate extracted claim fields for missing info"},
  fraud_check: { name: "fraud_check", description: "Detect potential fraud in claim"},
  summarize_claim: { name: "summarize_claim", description: "Summarize claim in 1-2 sentences"},
  // { name: "save_to_db", description: "Save claim to database" }
};

  while (steps < maxSteps) {
    steps++;

    // Ask LLM which tool to call next
    const prompt = `
You are an autonomous claims agent.
User Input: ${context.enrichedText}
Available tools: ${JSON.stringify(toolDescriptions)}

Current results so far: ${JSON.stringify(context.results)}

Decide NEXT tool to call and provide its INPUT as JSON like {tool:<tool_name>, input:<tool_input>}.
Respond with {"tool":"STOP"} if there are no available tools
Only respond in JSON format.`;

    const response = await model.generateContent(prompt);
    let decision;
    try {
      decision = JSON.parse(response.response.text().replaceAll("```json", "").replaceAll("```", ""));
    } catch (e) {
      console.error("Failed to parse agent decision:", e);
      break;
    }
    if (decision.tool === "STOP") break;

    if (!decision.tool || !isToolRegistered(decision.tool)) {
      console.error("Invalid tool requested by agent:", decision.tool);
      break;
    }
    delete toolDescriptions[decision.tool];
    // Call the selected tool via MCP
    const output = await mcp._registeredTools[decision.tool].handler(decision.input); // Get the registered tool function
    context.results[decision.tool] = output;
  }
 toolDescriptions = {
  extract_claim_fields: { name: "extract_claim_fields", description: "Extract structured fields from claim text"},
  validate_claim: { name: "validate_claim", description: "Validate extracted claim fields for missing info"},
  fraud_check: { name: "fraud_check", description: "Detect potential fraud in claim"},
  summarize_claim: { name: "summarize_claim", description: "Summarize claim in 1-2 sentences"},
  // { name: "save_to_db", description: "Save claim to database" }
};
  return context.results;
}
