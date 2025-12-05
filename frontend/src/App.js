import { useState } from "react";
import { processClaim } from "./api";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await processClaim(text);
      setResult(data.result);
    } catch (err) {
      setResult({ error: "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "50px auto",
        padding: 30,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "#f5f7fa",
        borderRadius: 12,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>
        Multi-Agent Claim Processor
      </h2>

      <textarea
        rows={6}
        style={{
          width: "100%",
          padding: 15,
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 16,
          resize: "vertical",
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your claim here..."
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: 15,
          padding: 15,
          borderRadius: 8,
          border: "none",
          background: loading ? "#999" : "#4f46e5",
          color: "#fff",
          fontSize: 16,
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.3s",
        }}
      >
        {loading ? "Processing..." : "Submit Claim"}
      </button>

      {loading && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="loader"></div>
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            borderRadius: 12,
            background: "#fff",
            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </div>
      )}

      {/* Loader CSS */}
      <style>
        {`
          .loader {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #4f46e5;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}
