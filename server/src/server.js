// src/server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";

import { initializeRAG, queryRAG } from "./rag.js";
import pdfParse from "pdf-parse-fixed";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

// Memory storage for uploaded PDFs
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const lm = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Initialize RAG
console.log("Initializing RAG...");
await initializeRAG();
console.log("RAG ready.");

// ---------------- /ask endpoint ----------------
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).send({ error: "Question is required" });

  try {
    const context = await queryRAG(question);

    const prompt = `
You are an Insurance Claims Assistant.
Answer the question below using ONLY the context provided.

CONTEXT:
${context}

QUESTION:
${question}
`;

    const resp = await lm.generateContent(prompt);
    const answer = await resp.response.text();

    res.json({ answer, context });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- /process-claim endpoint ----------------
app.post("/process-claim", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

  try {
    const pdfData = await pdfParse(req.file.buffer);
    const claimText = pdfData.text.trim();

    if (!claimText) return res.status(400).json({ error: "PDF contains no readable text" });

    // Query RAG for relevant context
    const context = await queryRAG(claimText);

    const prompt = `
You are an Insurance Claims Assistant.
Use ONLY the context below to summarize the claim, identify missing information, and suggest next steps.

CONTEXT:
${context}

CLAIM:
${claimText}
`;

    const resp = await lm.generateContent(prompt);
    const answer = await resp.response.text();

    res.json({ answer, extractedText: claimText, context });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

// ---------------- Start Server ----------------
app.listen(3000, () => console.log("Server started on port 3000"));
