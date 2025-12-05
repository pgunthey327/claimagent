import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import autonomousAgent from "./autonomousOrchestrator.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/process-claim", async (req, res) => {
  const { text } = req.body;

  try {
 

    const result = await autonomousAgent(text);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(process.env.PORT || 3001, () =>
  console.log(`Autonomous MCP Orchestrator running on port ${process.env.PORT || 3001}`)
);
