"use client";
// components/TokenDisplay.tsx
import React, { useState } from "react";

interface TokenDisplayProps {
  token: string;
}

export default function TokenDisplay({ token }: TokenDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-2xl p-4 text-center"
      style={{
        background: "linear-gradient(135deg, #FFF5E4, #FFD6DF)",
        border: "2px dashed #FFB7C5",
      }}
    >
      <p className="text-xs font-semibold text-gray-400 mb-2 tracking-widest uppercase">
        Your Gacha Token
      </p>
      <div className="flex items-center justify-center gap-3">
        <span
          className="font-bold text-2xl tracking-[0.3em]"
          style={{ color: "#FF5C8A", fontFamily: "monospace" }}
        >
          {token}
        </span>
        <button
          onClick={copyToClipboard}
          className="rounded-xl p-2 transition-all duration-200 hover:scale-110"
          style={{ background: copied ? "#C4F5E0" : "#FFB7C5" }}
          title="Copy token"
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17L4 12"
                stroke="#7ADDB8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke="white" strokeWidth="2" />
              <path
                d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">Save this token — you'll need it to open your box!</p>
    </div>
  );
}
