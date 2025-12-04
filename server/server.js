import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import { intakeAgent } from "./agents/intake.js";
import { missingInfoAgent } from "./agents/missingInfo.js";
import { fraudAgent } from "./agents/fraud.js";
import { routingAgent } from "./agents/routing.js";
import { summaryAgent } from "./agents/summary.js";
import { createEncryptedPDF } from "./utils/pdfEncrypt.js";
import { ChatOpenAI } from "@langchain/openai";

const upload = multer({ dest: "uploads/" });
const app = express();
app.use(express.json());
app.use(cors());

const llm = new ChatOpenAI({ model: "gpt-4.1" });

app.post("/api/run-claim", upload.array("files"), async (req, res) => {
  try {
    const pdfFile = req.files.find(f => f.mimetype === "application/pdf");
    const imageFiles = req.files.filter(f => f.mimetype.includes("image"));
console.log(pdfFile.path)
    const intake = await intakeAgent({
      pdfPath: pdfFile.path,
      imagePaths: imageFiles.map(f => f.path)
    });

    const missing = await missingInfoAgent(intake.pdfText);
    const fraud = await fraudAgent(intake);
    const routing = await routingAgent(intake);

    const summary = await summaryAgent({
      extracted: intake.pdfText,
      missing,
      fraud,
      routing
    });

    const pdfPath = await createEncryptedPDF(summary, "CLAIM-SECURE-2025");

    res.json({ summary, pdfPath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await llm.invoke(message);
    res.json({ reply: response.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/download", (req, res) => {
  const file = "./output/claim_summary_encrypted.pdf";
  res.download(file);
});

app.listen(4000, () => console.log("API Server running on port 4000"));
