import { useState } from "react";
import { processClaim } from "./api";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    "FNOL – Extract Claim Data",
    "Validate Claim Information",
    "Generate Summary",
    "Fraud Check",
  ];

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 500)); // UI delay

    try {
      const data = await processClaim(text);
      setResult(data.result);
    } catch {
      setResult({ error: "Something went wrong. Please try again." });
    }

    setLoading(false);
  };

  const getStepStatus = (index) => {
    if (loading) {
      if (index === 0) return "active";
      return "inactive";
    }
    if (result) return "completed";
    return "inactive";
  };

  return (
    <div className="container">
      <h2 className="title">🚀 AI-Powered Claim Processing Journey</h2>

      <textarea
        rows={6}
        className="input-box"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your claim here..."
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`submit-btn ${loading ? "disabled" : ""}`}
      >
        {loading ? "Processing..." : "Submit Claim"}
      </button>

      {/* Journey Timeline */}
      <div className="journey-card">
        <h3>Claim Processing Journey</h3>

        <div className="stepper">
          {steps.map((label, idx) => {
            const status = getStepStatus(idx);

            return (
              <div key={idx} className="step-item">
                <div className={`step-icon ${status}`}>
                  {status === "completed" ? "✓" : ""}
                </div>

                <div className="step-label">{label}</div>

                {/* connector line */}
                {idx < steps.length - 1 && (
                  <div className={`step-line ${status}`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Result */}
      {result && (
        <div className="result-card">
          <h3>📄 Final Processed Claim</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {/* CSS */}
      <style>
        {`
        .container {
          max-width: 750px;
          margin: 50px auto;
          padding: 30px;
          border-radius: 15px;
          background: #fdfdfd;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, sans-serif;
        }

        .title {
          text-align: center;
          margin-bottom: 20px;
          font-size: 26px;
          color: #333;
        }

        .input-box {
          width: 100%;
          padding: 15px;
          margin-top: 10px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 16px;
          resize: vertical;
        }

        .submit-btn {
          margin-top: 15px;
          width: 100%;
          padding: 15px;
          background: #4f46e5;
          color: white;
          font-size: 17px;
          font-weight: bold;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s;
        }

        .submit-btn:hover {
          background: #4338ca;
        }

        .submit-btn.disabled {
          background: #999;
          cursor: not-allowed;
        }

        /* Journey Card */
        .journey-card {
          margin-top: 30px;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .stepper {
          position: relative;
          margin-top: 20px;
          padding-left: 20px;
        }

        .step-item {
          position: relative;
          padding-bottom: 25px;
        }

        .step-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #bbb;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          position: absolute;
          left: -12px;
        }

        .step-icon.active {
          border: 3px solid #4f46e5;
          border-top: 3px solid transparent;
          animation: spin 1s linear infinite;
          background: white;
        }

        .step-icon.completed {
          background: #22c55e;
        }

        .step-label {
          margin-left: 20px;
          font-size: 16px;
          color: #333;
        }

        .step-line {
          width: 2px;
          height: 30px;
          background: #ccc;
          position: absolute;
          left: -2px;
          top: 26px;
        }

        .step-line.completed {
          background: #22c55e;
        }

        /* Result Card */
        .result-card {
          margin-top: 30px;
          padding: 20px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          white-space: pre-wrap;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
      </style>
    </div>
  );
}
