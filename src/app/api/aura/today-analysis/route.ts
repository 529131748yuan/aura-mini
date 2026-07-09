import { chatJson } from "@/lib/auraAiClient";
import { apiError, readLimitedJson } from "@/lib/auraApi";

type TodayAnalysisResult = {
  resultTitle: string;
  stateName: string;
  shortDesc: string;
  traits: string[];
  deepAnalysis: string;
  influences: string[];
  suitable: string[];
  avoid: string[];
  quote: string;
  funComment: string;
  appReason: string;
};

export async function POST(request: Request) {
  try {
    const body = await readLimitedJson(request, 5000);
    if (!body) return Response.json(apiError, { status: 400 });

    const systemPrompt =
      "你是气场小程序的今日状态分析师。面向 31+ 女性用户，关注感情、人际、工作压力、长期内耗、自我成长。必须严格围绕 input.answers、input.scores、input.primaryDimension、input.secondaryDimension 和 input.testProfile 生成，不要写成通用模板。stateName 必须等于 input.resultType，不允许自行改状态名。先共情，再解释状态形成原因，再给建议。不要绝对化，不要恐吓。输出 JSON。";
    const userPrompt = JSON.stringify({
      task: "根据今日状态测试结果生成深度分析，并保持本地判定的状态名称不变。",
      outputSchema: {
        resultTitle: "string",
        stateName: "string",
        shortDesc: "string",
        traits: ["string", "string", "string"],
        deepAnalysis: "string",
        influences: ["string"],
        suitable: ["string"],
        avoid: ["string"],
        quote: "string",
        funComment: "string",
        appReason: "string",
      },
      input: body,
    });

    const aiResult = await chatJson<TodayAnalysisResult>({
      systemPrompt,
      userPrompt,
      temperature: 0.75,
      maxTokens: 1800,
    });

    if (aiResult?.resultTitle && aiResult?.stateName) {
      return Response.json(aiResult);
    }

    if (body.localMockResult) {
      return Response.json(body.localMockResult);
    }

    return Response.json(apiError, { status: 502 });
  } catch {
    return Response.json(apiError, { status: 500 });
  }
}
