"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Briefcase, FileText } from "lucide-react";

const styles = [
  { value: "formal", label: "正式", desc: "适合发给领导", icon: "🎩" },
  { value: "casual", label: "轻松", desc: "适合团队同步", icon: "😊" },
  { value: "detailed", label: "详细", desc: "包含更多细节", icon: "📊" },
  { value: "brief", label: "精简", desc: "只保留关键", icon: "✂️" },
] as const;

type StyleValue = (typeof styles)[number]["value"];

export default function InputForm() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [role, setRole] = useState("");
  const [style, setStyle] = useState<StyleValue>("formal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = inputText.trim().length >= 10 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText: inputText.trim(),
          role: role.trim() || undefined,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "生成失败，请重试");
      }

      // Save to localStorage for history
      const history = JSON.parse(localStorage.getItem("wr_history") || "[]");
      const record = {
        id: crypto.randomUUID(),
        inputText: inputText.trim(),
        role: role.trim() || undefined,
        style,
        outputText: data.output,
        createdAt: new Date().toISOString(),
      };
      history.unshift(record);
      if (history.length > 50) history.length = 50;
      localStorage.setItem("wr_history", JSON.stringify(history));

      router.push(`/result?id=${record.id}`);
    } catch (err: any) {
      setError(err.message || "网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Role input */}
      <div>
        <label htmlFor="role" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
          <Briefcase className="w-4 h-4 text-gray-400" />
          你的职位/角色
          <span className="font-normal text-gray-400">（可选，AI 会根据角色调整语气）</span>
        </label>
        <input
          id="role"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="例如：前端开发工程师、产品经理、运营专员..."
          className="input-field"
          maxLength={50}
        />
      </div>

      {/* Main input */}
      <div>
        <label htmlFor="input" className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
          <FileText className="w-4 h-4 text-gray-400" />
          本周工作内容
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id="input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`例如：\n• 完成了用户管理模块的优化，修复了 3 个 bug\n• 参与了需求评审，输出了技术方案文档\n• 协助测试团队完成了 v2.3 版本的回归测试\n• 下周计划：开始订单模块的重构`}
          rows={8}
          className="input-field resize-none font-mono text-sm leading-relaxed"
          maxLength={2000}
        />
        <div className="flex justify-between mt-2">
          <p className="text-xs text-gray-400">
            💡 可以列要点、贴笔记、或者直接粘贴你的工作记录
          </p>
          <p className={`text-xs font-mono ${inputText.length > 1800 ? "text-amber-500" : "text-gray-400"}`}>
            {inputText.length}/2000
          </p>
        </div>
      </div>

      {/* Style selector */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: "var(--foreground)" }}>
          选择周报风格
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {styles.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStyle(s.value)}
              className={`group p-3.5 rounded-xl border-2 transition-all duration-200 text-left ${
                style === s.value
                  ? "border-indigo-500 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
              style={style === s.value ? { backgroundColor: "rgba(238, 242, 255, 0.5)" } : {}}
            >
              <div className="text-lg mb-1">{s.icon}</div>
              <div className={`font-semibold text-sm ${style === s.value ? "text-indigo-700" : ""}`} style={style !== s.value ? { color: "var(--card-foreground)" } : {}}>
                {s.label}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2" style={{ color: "#b91c1c" }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="btn-primary w-full flex items-center justify-center gap-2.5 text-base py-3.5 rounded-xl"
        style={{
          backgroundColor: canSubmit ? "var(--primary)" : "#d1d5db",
          color: canSubmit ? "#fff" : "#9ca3af",
          cursor: canSubmit ? "pointer" : "not-allowed",
          opacity: canSubmit ? 1 : 0.5,
          boxShadow: canSubmit ? "0 10px 15px -3px rgba(99, 102, 241, 0.25)" : "none",
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            AI 正在生成周报...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            生成周报
          </>
        )}
      </button>
    </form>
  );
}
