import { describe, expect, it } from "vitest";
import {
  generateTodayMasterAnswer,
  getAdjacentStoryCategory,
  getStoryCategoryTabs,
  getTodayQuestionAccess,
  profileAppDownloadMessage,
  selectStoriesByCategory,
} from "./miniExperience";

describe("mini experience copy and access", () => {
  it("unlocks every today question", () => {
    expect(getTodayQuestionAccess(0).locked).toBe(false);
    expect(getTodayQuestionAccess(4).locked).toBe(false);
  });

  it("uses the life profile reason for app download guidance", () => {
    expect(profileAppDownloadMessage).toContain('今天，我是在分析"和你相似的人"。');
    expect(profileAppDownloadMessage).toContain('建立人生档案后，我才能真正分析"你"。');
  });

  it("builds story category tabs from stories", () => {
    const tabs = getStoryCategoryTabs([
      { category: "感情" },
      { category: "工作" },
      { category: "感情" },
    ]);

    expect(tabs).toEqual(["全部", "感情", "工作"]);
  });

  it("filters stories by the active category tab", () => {
    const stories = [
      { id: 1, category: "感情" },
      { id: 2, category: "工作" },
    ];

    expect(selectStoriesByCategory(stories, "全部").map((story) => story.id)).toEqual([1, 2]);
    expect(selectStoriesByCategory(stories, "工作").map((story) => story.id)).toEqual([2]);
  });

  it("finds the adjacent story category for swipe navigation", () => {
    const tabs = ["全部", "感情", "工作"];

    expect(getAdjacentStoryCategory(tabs, "全部", "next")).toBe("感情");
    expect(getAdjacentStoryCategory(tabs, "工作", "next")).toBe("工作");
    expect(getAdjacentStoryCategory(tabs, "工作", "previous")).toBe("感情");
  });

  it("generates a today AI master answer from the current state", () => {
    const answer = generateTodayMasterAnswer({
      question: "他为什么突然不回我消息？",
      statusName: "关系敏感期",
      resultTitle: "习惯照顾别人，却忘了照顾自己",
      quote: "你不是越来越脆弱，你只是太久没有被好好接住。",
    });

    expect(answer).toContain("关系敏感期");
    expect(answer).toContain("他为什么突然不回我消息");
    expect(answer).toContain("气场");
  });
});
