import "dotenv/config";
import { intakeAgent } from "./agents/intake.js";
import { missingInfoAgent } from "./agents/missingInfo.js";
import { fraudAgent } from "./agents/fraud.js";
import { routingAgent } from "./agents/routing.js";
import { summaryAgent } from "./agents/summary.js";
import { createEncryptedPDF } from "./utils/pdfEncrypt.js";

const runPipeline = async () => {
  console.log("▶ Running Agentic Insurance Pipeline...\n");

  // 1. Intake
  const intake = await intakeAgent({
    pdfPath: "./input_files/claim.pdf",
    imagePaths: []
  });

  // 2. Missing info
  const missing = await missingInfoAgent(intake.pdfText);

  // 3. Fraud
  const fraud = await fraudAgent(intake);

  // 4. Routing
  const routing = await routingAgent(intake);

  // 5. Summary
  const summary = await summaryAgent({
    extracted: intake.pdfText,
    missing,
    fraud,
    routing
  });

  console.log("\nFinal Summary:\n", summary);

  const pdfPath = await createEncryptedPDF(summary, "CLAIM-SECURE-2025");

  console.log(`\n🔐 Secure PDF saved at: ${pdfPath}`);
};

runPipeline();
