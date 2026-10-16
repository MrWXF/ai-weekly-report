// AI API 调用封装
// 支持多模型切换：OpenAI 兼容代理 / 通义千问 / 智谱

export interface GenerateParams {
  inputText: string;
  role?: string;
  style: "formal" | "casual" | "detailed" | "brief";
  onChunk?: (chunk: string) => void;
}

const stylePrompts: Record<string, string> = {
  formal: "正式风格：语言严谨得体，适合发送给领导或客户，体现专业性。",
  casual: "轻松风格：语言自然亲切，适合团队内部同步，不要过于严肃。",
  detailed: "详细风格：包含更多工作细节、数据和具体成果，内容充实。",
  brief: "精简风格：只保留最关键的信息，简洁有力，适合忙碌的领导快速阅读。",
};

export async function generateReport({
  inputText,
  role,
  style,
  onChunk,
}: GenerateParams): Promise<string> {
  const provider = process.env.AI_PROVIDER || "openai";

  if (provider === "openai") {
    return generateWithOpenAI({ inputText, role, style, onChunk });
  } else if (provider === "dashscope") {
    return generateWithDashScope({ inputText, role, style, onChunk });
  } else if (provider === "zhipu") {
    return generateWithZhiPu({ inputText, role, style, onChunk });
  } else {
    return generateWithOpenAI({ inputText, role, style, onChunk });
  }
}

/**
 * OpenAI 兼容代理模式（你的 chinadaas.com 代理用这个）
 * 环境变量：
 *   OPENAI_BASE_URL=https://llm.chinadaas.com
 *   OPENAI_API_KEY=sk-xxx
 *   OPENAI_MODEL=dashscope/qwen3.5-plus
 */
async function generateWithOpenAI({
  inputText,
  role,
  style,
}: GenerateParams): Promise<string> {
  const baseUrl = process.env.OPENAI_BASE_URL || "";
  const apiKey = process.env.OPENAI_API_KEY || "";
  const model = process.env.OPENAI_MODEL || "dashscope/qwen3.5-plus";
  const prompt = buildPrompt(inputText, role, style);

  const url = `${baseUrl}/v1/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "你是一个专业的周报生成助手。请根据用户输入生成结构清晰、语言得体的中文周报。",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API 调用失败 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "生成失败，请重试";
}

/**
 * 通义千问（DashScope OpenAI 兼容接口）
 */
async function generateWithDashScope({
  inputText,
  role,
  style,
}: GenerateParams): Promise<string> {
  const apiKey = process.env.DASHSCOPE_API_KEY || "";
  const prompt = buildPrompt(inputText, role, style);

  const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "qwen-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个专业的周报生成助手。请根据用户输入生成结构清晰、语言得体的中文周报。",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API 调用失败 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "生成失败，请重试";
}

/**
 * 智谱 AI
 */
async function generateWithZhiPu({
  inputText,
  role,
  style,
}: GenerateParams): Promise<string> {
  const apiKey = process.env.ZHIPU_API_KEY || "";
  const prompt = buildPrompt(inputText, role, style);

  const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "glm-4-flash",
      messages: [
        {
          role: "system",
          content: "你是一个专业的周报生成助手。请根据用户输入生成结构清晰、语言得体的中文周报。",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API 调用失败 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "生成失败，请重试";
}

function buildPrompt(inputText: string, role?: string, style?: string): string {
  const styleDesc = style ? stylePrompts[style] || "" : "";

  return `你是一个专业的周报生成助手。根据用户提供的本周工作内容，生成一份结构清晰、语言得体的周报。

用户信息：
${role ? `- 职位/角色：${role}` : ""}
- 本周工作内容：${inputText}
${styleDesc ? `- 风格要求：${styleDesc}` : ""}

请生成以下格式的周报：
1. **本周工作概览**（2-3 句话总结本周整体工作情况）
2. **完成的具体工作**（分条列出，每条包含做了什么 + 结果/进展）
3. **遇到的问题与风险**（如有，简要说明）
4. **下周计划**（2-3 条关键计划）

要求：
- 语言：中文
- 字数：300-600 字
- 条理清晰，重点突出
- 使用专业的职场语言`;
}
