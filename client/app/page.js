"use client";

import React, { useState } from "react";

export default function Home() {
  const [summary, setSummary] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileSelect = (e) => {
    setFiles(e.target.files);
  };

  // ✅ Send files + message on button click
  const handleSend = async () => {
    if (!files.length && !message.trim()) return;

    setLoading(true);

    const form = new FormData();
    for (let f of files) form.append("files", f);
    form.append("message", message);

    const res = await fetch("http://localhost:4000/api/run-claim", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setSummary(data.summary || null);

    // If backend sends chat response
    if (data.reply) {
      setChatHistory((prev) => [
        ...prev,
        { user: message, bot: data.reply },
      ]);
    }

    setMessage("");
    setFiles([]);
    setLoading(false);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Insurance Claim AI (Node + Next.js)</h1>

      {/* File Upload */}
      <div className="mt-6">
        <input type="file" multiple onChange={handleFileSelect} />
      </div>

      {/* Text Input */}
      <input
        className="p-2 border rounded w-full mt-4"
        placeholder="Add notes for your claim..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* SEND BUTTON */}
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleSend}
      >
        Send
      </button>

      {loading && <p>Processing claim... ⏳</p>}

      {/* Summary */}
      {summary && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-semibold">Claim Summary</h2>
          <pre>{JSON.stringify(summary, null, 2)}</pre>

          <a
            className="text-blue-600 underline"
            href="http://localhost:4000/api/download"
          >
            🔐 Download Encrypted PDF
          </a>
        </div>
      )}

      {/* Chat History */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">Adjuster Chat</h2>

        <div className="mt-4 space-y-3">
          {chatHistory.map((c, idx) => (
            <div key={idx} className="border p-2 rounded">
              <p><strong>You:</strong> {c.user}</p>
              <p><strong>AI:</strong> {c.bot}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
