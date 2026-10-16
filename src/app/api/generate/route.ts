import { generateReport } from "@/lib/ai";

export const maxDuration = 30; // Allow up to 30 seconds for AI response

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inputText, role, style } = body;

    // Validate input
    if (!inputText || typeof inputText !== "string") {
      return Response.json(
        { error: "请输入本周工作内容" },
        { status: 400 }
      );
    }

    if (inputText.length < 10) {
      return Response.json(
        { error: "输入内容太短，请至少输入 10 个字" },
        { status: 400 }
      );
    }

    if (inputText.length > 2000) {
      return Response.json(
        { error: "输入内容太长，请控制在 2000 字以内" },
        { status: 400 }
      );
    }

    // Validate style
    const validStyles = ["formal", "casual", "detailed", "brief"];
    const reportStyle = validStyles.includes(style) ? style : "formal";

    // Call AI to generate report
    const output = await generateReport({
      inputText,
      role,
      style: reportStyle as any,
    });

    return Response.json({ output });
  } catch (error: any) {
    console.error("Generate report error:", error);
    return Response.json(
      { error: error.message || "生成失败，请稍后重试" },
      { status: 500 }
    );
  }
}
