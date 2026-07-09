import { describe, expect, it } from "vitest";
import {
  AURA_FULL_PROFILE_FORM_KEY,
  AURA_FULL_PROFILE_RESULT_KEY,
  AURA_FULL_PROFILE_UNLOCKED_KEY,
  generateFullProfile,
  getFullProfileAgeGate,
  getFullProfileReportLength,
  getFullProfileStage,
  sanitizeFullProfileResult,
  type FullProfileFormData,
} from "./fullProfile";

const formData: FullProfileFormData = {
  birthDate: "1990-05-12",
  birthTime: "08:30",
  city: "上海",
  relationshipStatus: "恋爱中",
  mainConcern: "感情",
  recentState: "经常内耗",
};

describe("full profile unlock flow", () => {
  it("exports localStorage keys for unlock, form and generated result", () => {
    expect(AURA_FULL_PROFILE_UNLOCKED_KEY).toBe("auraFullProfileUnlocked");
    expect(AURA_FULL_PROFILE_FORM_KEY).toBe("auraFullProfileForm");
    expect(AURA_FULL_PROFILE_RESULT_KEY).toBe("auraFullProfileData");
  });

  it("blocks full profile generation before age twelve", () => {
    const underTwelve = getFullProfileAgeGate("2018-07-10", new Date("2026-07-09T00:00:00Z"));
    const alreadyTwelve = getFullProfileAgeGate("2014-07-09", new Date("2026-07-09T00:00:00Z"));

    expect(underTwelve.allowed).toBe(false);
    expect(underTwelve.message).toBe("气场尚未成型，无法提早解读");
    expect(alreadyTwelve.allowed).toBe(true);
  });

  it("derives the full profile stage from unlock and result state", () => {
    expect(getFullProfileStage(false, null)).toBe("locked");
    expect(getFullProfileStage(true, null)).toBe("unlocked");
    expect(getFullProfileStage(true, generateFullProfile(formData))).toBe("generated");
  });

  it("generates a complete mock profile from verification data", () => {
    const result = generateFullProfile(formData, {
      statusName: "关系敏感期",
      statusTitle: "习惯照顾别人，却忘了照顾自己",
      statusSummary: "你今天对关系里的语气、回应和距离格外敏感，真正需要的是被认真理解。",
      testProfile: {
        energyPattern: "情绪压住型：心里有话但暂时不想摊开，更需要被温和理解",
        relationshipPattern: "回应确认型：你更在意对方有没有认真回应你、理解你",
        pressurePattern: "求助犹豫型：想找人说，又担心打扰别人或显得麻烦",
        actionPattern: "理解补能型：你需要被理解，一旦有人接住你，行动感会回来",
        innerTrigger: "关系牵引型：今天最容易被一段关系牵动，回应和距离会影响你",
        answerPattern: "BBBBBBBBBB",
      },
    });

    expect(result.title).toBe("你的完整人生档案");
    expect(result.sections).toHaveLength(8);
    expect(result.fixedAura).toContain("基础资料");
    expect(result.fixedAura).toContain("天生固有气场");
    expect(result.fixedAura).toContain("固定命盘倾向");
    expect(result.currentState).toContain("关系敏感期");
    expect(result.currentState).toContain("今日显化气场");
    expect(result.currentState).toContain("回应确认型");
    expect(result.currentState).toContain("关系牵引型");
    expect(result.currentState).toContain("后天形成气场");
    expect(result.currentState).toContain("经常内耗");
    expect(result.relationshipPattern).toContain("回应");
    expect(result.environmentImpact).toContain("外部环境");
    expect(result.sevenDayAdvice.today).toHaveLength(3);
    expect(result.sevenDayAdvice.threeDays).toHaveLength(3);
    expect(result.sevenDayAdvice.sevenDays).toHaveLength(3);
    expect(getFullProfileReportLength(result)).toBeGreaterThanOrEqual(2200);
    expect(result.mainConcern).toBe("感情");
    expect(result.generatedAt).toBeTruthy();
    expect(JSON.stringify(result)).toContain("消息没有及时回");
    expect(JSON.stringify(result)).toContain("白天撑住");
    expect(JSON.stringify(result)).toContain("想解释又怕麻烦");
    expect(JSON.stringify(result)).not.toContain("mock");
    expect(JSON.stringify(result)).not.toContain("规则推导");
    expect(JSON.stringify(result)).not.toContain("命运决定论");
    expect(JSON.stringify(result)).not.toContain("当前先用");
    expect(JSON.stringify(result)).not.toContain("心理学");
    expect(JSON.stringify(result)).not.toContain("心理");
    expect(JSON.stringify(result)).not.toContain("出生信息");
    expect(JSON.stringify(result)).not.toContain("所在地区");
    expect(JSON.stringify(result)).not.toContain("地点");
    expect(JSON.stringify(result)).not.toContain(formData.birthDate);
    expect(JSON.stringify(result)).not.toContain(formData.birthTime);
    expect(JSON.stringify(result)).not.toContain(formData.city);
  });

  it("changes emphasis by concern, recent state, relationship and city", () => {
    const result = generateFullProfile({
      ...formData,
      city: "杭州",
      relationshipStatus: "关系复杂",
      mainConcern: "工作",
      recentState: "容易焦虑",
    });

    expect(result.currentState).toContain("工作");
    expect(result.relationshipPattern).toContain("关系复杂");
    expect(result.psychology).toContain("控制感");
    expect(result.environmentImpact).toContain("外部环境");
    expect(JSON.stringify(result)).not.toContain("杭州");
    expect(result.emotionActionPattern).toContain("行动");
  });

  it("does not echo raw birth date, birth time and city in the report", () => {
    const privateFormData: FullProfileFormData = {
      ...formData,
      birthDate: "1992-03-25",
      birthTime: "01:30",
      city: "东莞",
    };
    const resultText = JSON.stringify(generateFullProfile(privateFormData));

    expect(resultText).not.toContain("1992-03-25");
    expect(resultText).not.toContain("01:30");
    expect(resultText).not.toContain("东莞");
    expect(resultText).not.toMatch(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}，[^"，。]+/);
  });

  it("sanitizes legacy generated reports before display", () => {
    const legacy = generateFullProfile(formData);
    const sanitized = sanitizeFullProfileResult({
      ...legacy,
      subtitle: "结合出生信息、当前状态、地区环境与心理反应，生成报告。",
      fixedAura: "根据你的出生信息（1992-03-25 01:30，东莞），当前先用 mock 规则推导出一组固定气场倾向，而不是把它写成“命运决定论”。",
      psychology: "三、从心理学看，你为什么会反复这样。",
      sections: [
        { title: "三、从心理学看，你为什么会反复这样", content: "这里有心理推断和出生信息。", highlight: "心理能量" },
      ],
    });
    const text = JSON.stringify(sanitized);

    expect(text).not.toContain("1992-03-25");
    expect(text).not.toContain("01:30");
    expect(text).not.toContain("东莞");
    expect(text).not.toContain("出生信息");
    expect(text).not.toContain("心理学");
    expect(text).not.toContain("心理");
    expect(text).not.toContain("mock");
    expect(text).not.toContain("规则推导");
    expect(text).not.toContain("命运决定论");
    expect(text).not.toContain("当前先用");
    expect(text).toContain("从气场流向看");
  });
});
