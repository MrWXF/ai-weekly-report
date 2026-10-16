"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ArrowLeft, FileText, Calendar } from "lucide-react";

interface HistoryRecord {
  id: string;
  inputText: string;
  role?: string;
  style: string;
  outputText: string;
  createdAt: string;
}

const styleConfig: Record<string, { label: string; color: string; bg: string }> = {
  formal: { label: "正式", color: "text-indigo-700", bg: "bg-indigo-50" },
  casual: { label: "轻松", color: "text-amber-700", bg: "bg-amber-50" },
  detailed: { label: "详细", color: "text-emerald-700", bg: "bg-emerald-50" },
  brief: { label: "精简", color: "text-rose-700", bg: "bg-rose-50" },
};

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("wr_history");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("wr_history", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (confirm("确定要清空所有历史记录吗？此操作不可撤销。")) {
      setHistory([]);
      localStorage.removeItem("wr_history");
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "刚刚";
    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    if (diffDays < 7) return `${diffDays} 天前`;

    return d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold">历史记录</h1>
            <p className="text-sm text-gray-500">
              {history.length > 0 ? `共 ${history.length} 条记录` : "还没有记录"}
            </p>
          </div>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            清空全部
          </button>
        )}
      </div>

      {/* History list */}
      {history.length === 0 ? (
        <div className="card text-center py-20" style={{ boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" }}>
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-300" />
          </div>
          <p className="font-medium mb-2">还没有生成过周报</p>
          <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">
            去首页输入你的工作内容，AI 会帮你生成专业格式的周报
          </p>
          <button onClick={() => router.push("/")} className="btn-primary">
            去生成周报
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record, index) => {
            const sc = styleConfig[record.style] || styleConfig.formal;
            return (
              <div
                key={record.id}
                className="card cursor-pointer group hover:shadow-lg transition-all duration-200"
                style={{
                  boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)",
                  animationDelay: `${index * 50}ms`,
                }}
                onClick={() => router.push(`/result?id=${record.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.bg} ${sc.color}`}>
                        {sc.label}
                      </span>
                      {record.role && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                          {record.role}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
                        <Calendar className="w-3 h-3" />
                        {formatDate(record.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {record.inputText}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(record.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
