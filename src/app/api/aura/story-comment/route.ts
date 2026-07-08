import { chatJson } from "@/lib/auraAiClient";
import { apiError, readLimitedJson } from "@/lib/auraApi";

type StoryCommentResult = {
  aiComment: string;
  masterComment: string;
};

export async function POST(request: Request) {
  try {
    const body = await readLimitedJson(request, 6000);
    if (!body) return Response.json(apiError, { status: 400 });

    const systemPrompt =
      "你是气场小程序众生社区的故事点评助手。输出温柔、有洞察、适合女性用户阅读的 AI 解析和大师点评。不要评判用户，不要绝对化，输出 JSON。";
    const userPrompt = JSON.stringify({
      task: "为社区故事生成 AI 解析和大师点评。",
      outputSchema: { aiComment: "string", masterComment: "string" },
      input: body,
    });

    const aiResult = await chatJson<StoryCommentResult>({
      systemPrompt,
      userPrompt,
      temperature: 0.78,
      maxTokens: 900,
    });

    if (aiResult?.aiComment && aiResult?.masterComment) {
      return Response.json(aiResult);
    }

    return Response.json({
      aiComment: "这段经历里最值得被看见的，是你一直在努力维持体面，也在寻找一个更稳的回应。",
      masterComment: "先别急着判断对错，回到自己的感受里，看清这件事真正牵动你的是什么。",
    });
  } catch {
    return Response.json(apiError, { status: 500 });
  }
}
