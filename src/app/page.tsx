import InputForm from "@/components/InputForm";
import { Zap, Palette, Download, Sparkles, Shield, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "linear-gradient(135deg, rgba(165, 180, 252, 0.2), rgba(192, 132, 252, 0.2))" }}
        />
        <div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl"
          style={{ background: "linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(34, 211, 238, 0.1))" }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero section */}
        <div className="text-center mb-10 sm:mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            基于 AI 大语言模型
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            <span className="gradient-text">30 秒</span>{" "}
            <span className="text-gray-900">生成专业周报</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            输入本周做了什么，AI 帮你生成结构清晰、语言得体的周报
          </p>
        </div>

        {/* Input form */}
        <div className="card shadow-xl" style={{ boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)" }}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold">填写工作内容</h2>
              <p className="text-sm text-gray-500">AI 会自动整理成专业格式的周报</p>
            </div>
          </div>
          <InputForm />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
          <FeatureCard
            icon={<Zap className="w-5 h-5" />}
            title="超快生成"
            desc="输入内容，30 秒内生成完整周报"
            color="amber"
          />
          <FeatureCard
            icon={<Palette className="w-5 h-5" />}
            title="多种风格"
            desc="正式/轻松/详细/精简，按需切换"
            color="purple"
          />
          <FeatureCard
            icon={<Download className="w-5 h-5" />}
            title="一键导出"
            desc="复制内容或下载文本，随取随用"
            color="emerald"
          />
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>数据仅存储在本地</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>无需注册，即开即用</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>完全免费</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: "amber" | "purple" | "emerald";
}) {
  const colorMap = {
    amber: { bg: "bg-amber-50", border: "border-amber-100", icon: "text-amber-600" },
    purple: { bg: "bg-purple-50", border: "border-purple-100", icon: "text-purple-600" },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-100", icon: "text-emerald-600" },
  };
  const c = colorMap[color];

  return (
    <div
      className={`text-center p-5 rounded-xl ${c.bg} border ${c.border} transition-all duration-200 hover:shadow-md`}
      style={{ transition: "all 0.2s" }}
    >
      <div
        className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white ${c.icon} mb-3 shadow-sm`}
      >
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}
