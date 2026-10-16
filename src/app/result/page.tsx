"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import ResultDisplay from "@/components/ResultDisplay";

interface HistoryRecord {
  id: string;
  inputText: string;
  role?: string;
  style: string;
  outputText: string;
  createdAt: string;
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [record, setRecord] = useState<HistoryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push("/");
      return;
    }

    const history = JSON.parse(localStorage.getItem("wr_history") || "[]");
    const found = history.find((r: HistoryRecord) => r.id === id);
    if (found) {
      setRecord(found);
    }
    setLoading(false);
  }, [id, router]);

  const handleRegenerate = async () => {
    if (!record) return;
    setRegenerating(true);

    try {
      const styles = ["formal", "casual", "detailed", "brief"];
      const currentIndex = styles.indexOf(record.style);
      const nextStyle = styles[(currentIndex + 1) % styles.length];

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText: record.inputText,
          role: record.role,
          style: nextStyle,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const updatedRecord = { ...record, outputText: data.output, style: nextStyle };
      setRecord(updatedRecord);

      const history = JSON.parse(localStorage.getItem("wr_history") || "[]");
      const index = history.findIndex((r: HistoryRecord) => r.id === id);
      if (index !== -1) {
        history[index] = updatedRecord;
        localStorage.setItem("wr_history", JSON.stringify(history));
      }
    } catch (err: any) {
      alert(err.message || "重新生成失败");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: "var(--primary)" }} />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500 mb-6">未找到该条记录</p>
        <button onClick={() => router.push("/")} className="btn-primary">
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      {/* Back button + title */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/")}
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold">你的周报</h1>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            风格：<span className="font-medium" style={{ color: "var(--primary)" }}>{getStyleLabel(record.style)}</span>
            {regenerating && (
              <span className="text-amber-600 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> 重新生成中...
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Result */}
      {regenerating ? (
        <div className="card flex items-center justify-center py-16" style={{ boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" }}>
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "var(--primary) transparent transparent transparent" }} />
            </div>
            <p className="font-medium" style={{ color: "var(--foreground)" }}>AI 正在重新生成...</p>
            <p className="text-sm text-gray-400 mt-1">大约需要 10-20 秒</p>
          </div>
        </div>
      ) : (
        <ResultDisplay
          outputText={record.outputText}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
}

function getStyleLabel(style: string): string {
  const labels: Record<string, string> = {
    formal: "正式",
    casual: "轻松",
    detailed: "详细",
    brief: "精简",
  };
  return labels[style] || style;
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--primary)" }} />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
