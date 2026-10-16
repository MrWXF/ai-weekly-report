import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 周报生成器 - 30秒生成专业周报",
  description: "输入本周工作内容，AI 帮你生成专业格式的周报。支持多种风格，一键复制导出。",
  keywords: ["周报", "AI周报", "周报生成器", "工作总结", "AI写作"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
        {/* Header */}
        <header className="sticky top-0 z-50 glass border-b border-gray-200/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-lg font-bold">AI 周报生成器</span>
            </a>
            <nav className="flex items-center gap-1">
              <a
                href="/history"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                历史记录
              </a>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-8 mt-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600" />
                <span>AI 周报生成器 — 让写周报不再是负担</span>
              </div>
              <div className="flex items-center gap-4">
                <span>基于 AI 大语言模型</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">安全 · 快速 · 专业</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
