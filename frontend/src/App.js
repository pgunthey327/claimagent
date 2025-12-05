import { useState } from "react";
import { processClaim } from "./api";

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [steps, setSteps] = useState({
    extract: "inactive",
    validate: "inactive",
    fraud: "inactive",
    summary: "inactive",
  });

  const stepOrder = ["extract", "validate", "fraud", "summary"];

  const startSimulationSequence = async () => {
    for (let i = 0; i < stepOrder.length - 1; i++) {
      const curr = stepOrder[i];
      const next = stepOrder[i + 1];

      // Set current step active
      setSteps((p) => ({ ...p, [curr]: "active" }));
      await new Promise((r) => setTimeout(r, 1000));

      // Set current step completed
      setSteps((p) => ({ ...p, [curr]: "completed", [next]: "active" }));
    }

    // ❗ For the last step "summary":
    // Keep it ACTIVE but DO NOT mark completed.
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    // Reset UI
    setResponse(null);
    setSteps({
      extract: "inactive",
      validate: "inactive",
      fraud: "inactive",
      summary: "inactive",
    });

    setLoading(true);

    // Start UI simulation
    startSimulationSequence();

    // ---- Actual backend call ----
    try {
      const data = await processClaim(input);

      setResponse(data.result);

      // Now mark final step completed
      setSteps((p) => ({ ...p, summary: "completed" }));
    } catch (e) {
      alert("Backend error");
    }

    setLoading(false);
  };

  const getStepClass = (state) => {
    if (state === "active") return "bg-blue-100 border-blue-600";
    if (state === "completed") return "bg-green-100 border-green-600";
    return "bg-gray-200 border-gray-400"; // inactive
  };

  return (
    <div style={{ display: "flex", height: "100vh", padding: 20, gap: 20 }}>

      {/* LEFT SIDE — JOURNEY */}
      <div
        style={{
          width: 250,
          background: "white",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ fontWeight: "bold", marginBottom: 20 }}>
          Claim Journey
        </h3>

        {stepOrder.map((step) => (
          <div
            key={step}
            style={{
              padding: 12,
              marginBottom: 12,
              borderRadius: 8,
              border: "2px solid",
              fontWeight: "500",
              ...((steps[step] === "active" && { color: "#1e40af" }) ||
                (steps[step] === "completed" && { color: "#166534" })),
              background:
                steps[step] === "active"
                  ? "#dbeafe"
                  : steps[step] === "completed"
                  ? "#dcfce7"
                  : "#e5e7eb",
            }}
          >
            {step === "extract" && "1. Extract Fields"}
            {step === "validate" && "2. Validate Claim"}
            {step === "fraud" && "3. Fraud Check"}
            {step === "summary" && "4. Summarize Claim"}

            <span style={{ float: "right" }}>
              {steps[step] === "active" && "⏳"}
              {steps[step] === "completed" && "✔️"}
            </span>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE — MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          background: "white",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "auto",
        }}
      >
        <h2 style={{ fontWeight: "bold", fontSize: 24, marginBottom: 20 }}>
          Multi-Agent Claim Processor
        </h2>

        {/* Input */}
        <textarea
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your claim here..."
          style={{
            width: "100%",
            borderRadius: 8,
            padding: 12,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: 15,
            padding: "14px 20px",
            background: loading ? "#777" : "#4f46e5",
            color: "white",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Processing..." : "Initiate Claim"}
        </button>

        {/* Response */}
        {response && (
          <div style={{ marginTop: 30 }}>
            <h3 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
              Extracted Details
            </h3>

            {/* Mapping the extract fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginBottom: 20,
              }}
            >
              {Object.entries(response.extract_claim_fields).map(
                ([key, value]) => (
                  <div key={key}>
                    <label style={{ fontWeight: "600" }}>
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>
                    <input
                      value={value}
                      readOnly
                      style={{
                        width: "100%",
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        padding: 8,
                        marginTop: 4,
                      }}
                    />
                  </div>
                )
              )}
            </div>

            {/* Validation */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 8 }}>Validation Result</h4>
              <input
                readOnly
                value={
                  response.validate_claim.valid
                    ? "VALID CLAIM ✔️"
                    : "Missing: " + response.validate_claim.missing.join(", ")
                }
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                }}
              />
            </div>

            {/* Fraud */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 8 }}>Fraud Check</h4>
              <textarea
                readOnly
                value={response.fraud_check}
                style={{
                  width: "100%",
                  padding: 10,
                  height: 90,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                }}
              />
            </div>

            {/* Summary */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 8 }}>Claim Summary</h4>
              <textarea
                readOnly
                value={response.summarize_claim}
                style={{
                  width: "100%",
                  padding: 10,
                  height: 90,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
