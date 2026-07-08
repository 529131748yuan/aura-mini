import { generateFullProfile, sanitizeFullProfileResult, type FullProfileFormData, type FullProfileResult } from "./fullProfile";

export const apiError = { ok: false, error: "AI_GENERATION_FAILED" };

export async function readLimitedJson(request: Request, maxLength: number) {
  const text = await request.text();
  if (text.length > maxLength) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function fullProfileToApiResult(result: FullProfileResult) {
  const sanitized = sanitizeFullProfileResult(result);
  return {
    ...sanitized,
    fixedProfile: sanitized.fixedAura,
    psychologyAnalysis: sanitized.psychology,
    environmentInfluence: sanitized.environmentImpact,
    masterGuide: sanitized.masterPrompt,
  };
}

export function normalizeFullProfileResult(form: FullProfileFormData, raw: Partial<FullProfileResult> & Record<string, unknown>) {
  const fallback = generateFullProfile(form);
  const result: FullProfileResult = {
    ...fallback,
    intro: typeof raw.intro === "string" ? raw.intro : fallback.intro,
    fixedAura: typeof raw.fixedProfile === "string" ? raw.fixedProfile : typeof raw.fixedAura === "string" ? raw.fixedAura : fallback.fixedAura,
    currentState: typeof raw.currentState === "string" ? raw.currentState : fallback.currentState,
    psychology: typeof raw.psychologyAnalysis === "string" ? raw.psychologyAnalysis : typeof raw.psychology === "string" ? raw.psychology : fallback.psychology,
    relationshipPattern:
      typeof raw.relationshipPattern === "string" ? raw.relationshipPattern : fallback.relationshipPattern,
    emotionActionPattern:
      typeof raw.emotionActionPattern === "string" ? raw.emotionActionPattern : fallback.emotionActionPattern,
    environmentImpact:
      typeof raw.environmentInfluence === "string"
        ? raw.environmentInfluence
        : typeof raw.environmentImpact === "string"
          ? raw.environmentImpact
          : fallback.environmentImpact,
    masterPrompt: typeof raw.masterGuide === "string" ? raw.masterGuide : typeof raw.masterPrompt === "string" ? raw.masterPrompt : fallback.masterPrompt,
  };

  result.sections = [
    { title: "一、你的固定气场：你天生更容易被什么影响", content: result.fixedAura, highlight: "敏感不是缺点，它让你更会照顾人，也更容易察觉问题。" },
    { title: "二、你现在处在什么状态", content: result.currentState, highlight: "这不是能力问题，而是内在能量分配问题。" },
    { title: "三、从气场流向看，你为什么会反复这样", content: result.psychology, highlight: "你不是软弱，而是太习惯替关系和结果负责。" },
    { title: "四、你的关系模式：为什么你容易在关系里累", content: result.relationshipPattern, highlight: "你真正需要的是稳定、明确、可感知的回应。" },
    { title: "五、你的情绪和行动节奏", content: result.emotionActionPattern, highlight: "你的行动力来自内在确认感，而不是外界催促。" },
    { title: "六、环境正在怎样影响你", content: result.environmentImpact, highlight: "环境不会决定你，但会影响你的恢复速度。" },
    { title: "七、接下来 7 天，你应该怎么顺势调整", content: "今天开始、3 天内、7 天内分三层调整：先降消耗，再恢复节奏，最后整理关系和目标。", highlight: "不要急着翻盘，先把自己从内耗里慢慢带回来。" },
    { title: "如果你还有一个放不下的问题", content: result.masterPrompt, highlight: "具体的人、选择和反复出现的问题，适合继续问大师。" },
  ];

  return sanitizeFullProfileResult(result);
}
