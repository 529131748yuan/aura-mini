import { describe, expect, it } from "vitest";
import { generateTodayGuide } from "./auraEngine";

describe("generateTodayGuide", () => {
  it("returns emotion sorting guidance for poor sleep, anxiety, and work concern", () => {
    const guide = generateTodayGuide({
      sleep: "很差",
      mood: "很焦虑",
      concern: "工作",
      weather: "阴天",
    });

    expect(guide.status).toBe("情绪整理日");
    expect(guide.overview).toContain("不适合硬冲");
    expect(guide.doList).toContain("把重要工作拆成小步骤");
    expect(guide.avoidList).toContain("避免和同事或老板硬碰硬");
  });

  it("returns light social guidance for good mood and relationship concern", () => {
    const guide = generateTodayGuide({
      sleep: "很好",
      mood: "状态不错",
      concern: "感情",
      weather: "晴天",
    });

    expect(guide.status).toBe("轻社交日");
    expect(guide.overview).toContain("适合主动靠近");
    expect(guide.doList).toContain("适合发起一次轻松联系");
    expect(guide.avoidList).toContain("避免用试探代替表达");
  });

  it("keeps a gentle recovery day for bad sleep with calm mood", () => {
    const guide = generateTodayGuide({
      sleep: "很差",
      mood: "平静",
      concern: "穿搭",
      weather: "下雨",
    });

    expect(guide.status).toBe("恢复日");
    expect(guide.why).toContain("睡眠");
    expect(guide.questionAnswers[0].title).toBe("今天的人际关系要注意什么？");
  });

  it("adds event insight when the user describes what happened today", () => {
    const guide = generateTodayGuide(
      {
        sleep: "很差",
        mood: "有点烦",
        concern: "工作",
        weather: "阴天",
      },
      "今天老板突然批评我",
    );

    expect(guide.eventInsight?.title).toBe("我看到你今天最在意的是");
    expect(guide.eventInsight?.content).toContain("努力有没有被看见");
    expect(guide.overview).toContain("不适合急着证明自己");
    expect(guide.why).toContain("被批评");
    expect(guide.why).toContain("价值有没有被看见");
  });

  it("keeps the existing guide shape when no event text is provided", () => {
    const guide = generateTodayGuide({
      sleep: "一般",
      mood: "平静",
      concern: "感情",
      weather: "晴天",
    });

    expect(guide.eventInsight).toBeUndefined();
  });
});
