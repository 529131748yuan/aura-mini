import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("/api/aura/today-analysis", () => {
  it("falls back to local mock result when AI is unavailable", async () => {
    const previousKey = process.env.AURA_AI_API_KEY;
    delete process.env.AURA_AI_API_KEY;

    const response = await POST(
      new Request("http://localhost/api/aura/today-analysis", {
        method: "POST",
        body: JSON.stringify({
          answers: ["B", "B"],
          scores: { relationship: 2 },
          resultType: "关系敏感期",
          localMockResult: {
            resultTitle: "习惯照顾别人，却忘了照顾自己",
            stateName: "关系敏感期",
            shortDesc: "你今天对关系里的回应格外敏感。",
            traits: ["你会先照顾别人感受", "你在意稳定回应", "你需要恢复节奏"],
            deepAnalysis: "mock analysis",
            influences: ["更在意语气", "更容易复盘", "更需要确定感"],
            suitable: ["慢一点"],
            avoid: ["反复解释"],
            quote: "你值得被认真回应。",
            funComment: "关系雷达很灵。",
            appReason: "完整人生档案可以继续分析。",
          },
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.stateName).toBe("关系敏感期");
    expect(body.resultTitle).toBe("习惯照顾别人，却忘了照顾自己");

    if (previousKey) {
      process.env.AURA_AI_API_KEY = previousKey;
    }
  });
});
