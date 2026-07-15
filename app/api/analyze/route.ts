import { NextRequest, NextResponse } from "next/server";

type RawBrief = {
  verdict?: string;
  risk_score?: number;
  summary?: string;
  opportunities?: string[];
  risks?: string[];
  diligence_questions?: string[];
  recommendation?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const memo = typeof body.memo === "string" ? body.memo.trim().slice(0, 10000) : "";
    const projectType = typeof body.projectType === "string" ? body.projectType.trim().slice(0, 80) : "Web3 project";
    if (!memo) return NextResponse.json({ error: "请先粘贴 DAO 提案、项目介绍或策略文本。" }, { status: 400 });

    const apiKey = process.env.ZG_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "服务尚未配置 0G Private Computer API Key。" }, { status: 503 });

    const model = process.env.ZG_MODEL || "0gm-1.0-35b-a3b";
    const startedAt = Date.now();
    const response = await call0G(apiKey, model, memo, projectType);
    const parsed = safeParseBrief(response.text);
    const riskScore = Math.max(0, Math.min(100, Math.round(Number(parsed.risk_score) || 50)));
    const label = riskScore >= 70 ? "高风险，暂缓参与" : riskScore >= 40 ? "中等风险，继续尽调" : "低到中风险，可继续研究";

    return NextResponse.json({
      riskScore,
      label,
      verdict: String(parsed.verdict || "需要进一步尽调"),
      summary: String(parsed.summary || "0G 模型已完成摘要，但返回内容不完整。"),
      opportunities: toList(parsed.opportunities, 4),
      risks: toList(parsed.risks, 5),
      diligenceQuestions: toList(parsed.diligence_questions, 5),
      recommendation: String(parsed.recommendation || "继续查阅项目白皮书、合约审计、资金流和团队公开记录。"),
      analyzedAt: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
      model,
      requestId: response.requestId,
      teeVerified: response.teeVerified,
      provider: response.provider,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "0G 风险摘要失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function call0G(apiKey: string, model: string, memo: string, projectType: string) {
  const prompt = `你是 Web3 风险分析员。请分析以下 ${projectType} 材料，目标是帮助普通用户决定是否值得继续尽调，不要给投资建议。

材料：
${memo}

只输出合法 JSON 对象，不要 Markdown，不要解释，不要输出思考过程。字段必须为：
{"verdict":"不超过18字的结论","risk_score":0到100的整数,"summary":"120字以内摘要","opportunities":["2到4条机会"],"risks":["3到5条风险"],"diligence_questions":["3到5个下一步尽调问题"],"recommendation":"一句具体建议"}

risk_score 表示参与或继续投入注意力的风险程度，100 为极高风险。信息不足时必须提高风险分。`;

  const response = await fetch("https://router-api.0g.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${apiKey}`,
      "content-type": "application/json",
      "x-0g-provider-sort": "latency",
      "x-0g-provider-allow-fallbacks": "true",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 900,
      response_format: { type: "json_object" },
      verify_tee: true,
    }),
    signal: AbortSignal.timeout(90000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`0G Private Computer 调用失败（${response.status}）${detail ? `：${detail.slice(0, 160)}` : ""}`);
  }
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || "";
  return {
    text,
    requestId: String(data?.id || data?.trace?.request_id || "unavailable"),
    teeVerified: Boolean(data?.tee_verified || data?.trace?.tee_verified),
    provider: typeof data?.provider === "string" ? data.provider : data?.trace?.provider,
  };
}

function safeParseBrief(text: string): RawBrief {
  const clean = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    return {
      verdict: "格式异常",
      risk_score: 70,
      summary: "模型本次未返回可解析的结构化摘要，系统已按高风险降级展示。",
      opportunities: ["可重新提交更完整的项目文本。"],
      risks: ["模型输出格式异常，当前结果不能作为尽调依据。", "需要补充白皮书、合约地址、团队信息或治理提案原文。"],
      diligence_questions: ["项目是否有公开合约地址？", "是否存在审计报告？", "资金来源和治理权限是否透明？"],
      recommendation: "请补充更完整材料后重新分析。",
    };
  }
}

function toList(value: unknown, max: number) {
  return Array.isArray(value) ? value.slice(0, max).map(String) : [];
}
