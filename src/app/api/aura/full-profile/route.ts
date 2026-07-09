import { chatJson } from "@/lib/auraAiClient";
import { apiError, fullProfileToApiResult, normalizeFullProfileResult, readLimitedJson } from "@/lib/auraApi";
import { generateFullProfile, getFullProfileAgeGate, type FullProfileFormData } from "@/lib/fullProfile";

export async function POST(request: Request) {
  try {
    const body = await readLimitedJson(request, 8000);
    if (!body) return Response.json(apiError, { status: 400 });

    const form: FullProfileFormData = {
      birthDate: String(body.birthDate ?? ""),
      birthTime: String(body.birthTime ?? ""),
      city: String(body.city ?? ""),
      relationshipStatus: body.relationshipStatus,
      mainConcern: body.mainConcern,
      recentState: body.recentState,
    };
    const ageGate = getFullProfileAgeGate(form.birthDate);

    if (!ageGate.allowed) {
      return Response.json({ ok: false, error: "FULL_PROFILE_AGE_TOO_YOUNG", message: ageGate.message }, { status: 400 });
    }

    const systemPrompt =
      "你是气场小程序的完整人生档案分析师。结合基础资料、当前状态、关系模式、外部环境、10 题今日测试画像与气场反应生成详细报告。传统信息只作为天生固有气场参考，不要说决定命运。todayTestResult.testProfile 必须作为“今日显化气场”参与分析，不能凭空泛写。内容有付费价值感，总字数 1500-2500 字，输出 JSON。不要回显具体生日、出生时间、城市等隐私。不要出现“出生信息”“地点”“心理学”“心理”等用户可见字眼。";
    const userPrompt = JSON.stringify({
      task: "生成完整人生档案。",
      outputSchema: {
        intro: "string",
        fixedProfile: "string",
        currentState: "string",
        psychologyAnalysis: "string",
        relationshipPattern: "string",
        emotionActionPattern: "string",
        environmentInfluence: "string",
        sevenDayAdvice: { today: ["string"], threeDays: ["string"], sevenDays: ["string"] },
        masterGuide: "string",
      },
      input: {
        ...body,
        privacyRule: "不要在结果中直接展示 birthDate、birthTime、city 原文。",
        logicRule:
          "完整档案需要明确区分：天生固有气场来自基础资料；后天形成气场来自近期状态、感情状态、主要困扰和环境；今日显化气场来自 todayTestResult 的 10 题答案、scores、primaryDimension、secondaryDimension、testProfile。",
      },
    });

    const aiResult = await chatJson<Record<string, unknown>>({
      systemPrompt,
      userPrompt,
      temperature: 0.72,
      maxTokens: 3200,
    });

    if (aiResult?.intro) {
      return Response.json(fullProfileToApiResult(normalizeFullProfileResult(form, aiResult, body.todayTestResult)));
    }

    return Response.json(fullProfileToApiResult(generateFullProfile(form, body.todayTestResult)));
  } catch {
    return Response.json(apiError, { status: 500 });
  }
}
