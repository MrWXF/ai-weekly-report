"use client";

import { useState } from "react";
import { Copy, Download, RotateCw, Check, FileText } from "lucide-react";

interface ResultDisplayProps {
  outputText: string;
  onRegenerate: () => void;
}

export default function ResultDisplay({ outputText, onRegenerate }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `周报_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render markdown-like text with basic formatting
  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Bold text: **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={j} className="font-semibold" style={{ color: "var(--card-foreground)" }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={j}>{part}</span>;
      });

      // Heading-like lines
      if (line.match(/^\d+\.\s*\*\*.*\*\*/)) {
        return (
          <h3 key={i} className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2" style={{ color: "var(--card-foreground)" }}>
            <div className="w-1.5 h-6 rounded-full" style={{ background: "linear-gradient(to bottom, #6366f1, #a855f7)" }} />
            {rendered}
          </h3>
        );
      }

      // List items
      if (line.match(/^[-*]\s/) || line.match(/^\d+\.\s/)) {
        return (
          <li key={i} className="ml-4 leading-relaxed py-0.5 flex items-start gap-2" style={{ color: "var(--foreground)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
            <span>{rendered}</span>
          </li>
        );
      }

      // Empty line
      if (line.trim() === "") {
        return <div key={i} className="h-2" />;
      }

      return (
        <p key={i} className="leading-relaxed" style={{ color: "var(--foreground)" }}>
          {rendered}
        </p>
      );
    });
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          className={`btn-secondary flex items-center gap-2 text-sm transition-all ${
            copied ? "!bg-emerald-50 !text-emerald-700 !border-emerald-200" : ""
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              已复制
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              复制内容
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" />
          导出文本
        </button>
        <button
          onClick={onRegenerate}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <RotateCw className="w-4 h-4" />
          换风格
        </button>
      </div>

      {/* Report content */}
      <div className="card" style={{ boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)", border: "none" }}>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">你的周报</h3>
            <p className="text-xs text-gray-500">AI 生成，可直接使用</p>
          </div>
        </div>
        <div className="max-w-none">
          {renderContent(outputText)}
        </div>
      </div>
    </div>
  );
}
