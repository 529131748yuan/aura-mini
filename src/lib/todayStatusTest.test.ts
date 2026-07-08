import { describe, expect, it } from "vitest";
import {
  AURA_TODAY_TEST_ANSWERS_KEY,
  AURA_TODAY_TEST_DATE_KEY,
  AURA_TODAY_TEST_RESULT_KEY,
  calculateTodayStatusResult,
  todayStatusQuestions,
  todayStatusTypes,
  type TestOptionKey,
} from "./todayStatusTest";

describe("today status test", () => {
  it("contains ten single-choice questions and thirty status types", () => {
    expect(todayStatusQuestions).toHaveLength(10);
    expect(todayStatusQuestions.every((question) => question.options.length === 4)).toBe(true);
    expect(todayStatusTypes).toHaveLength(30);
  });

  it("returns a status result with traits and guidance", () => {
    const result = calculateTodayStatusResult(["B", "B", "B", "B", "B", "B", "B", "B", "B", "B"]);

    expect(result.scores.relationship).toBe(10);
    expect(result.status.name).toBeTruthy();
    expect(result.status.resultTitle).toBeTruthy();
    expect(result.status.deepAnalysis.length).toBeGreaterThanOrEqual(250);
    expect(result.status.deepAnalysis.length).toBeLessThanOrEqual(400);
    expect(result.status.influences.length).toBeGreaterThanOrEqual(3);
    expect(result.status.influences.length).toBeLessThanOrEqual(5);
    expect(result.status.quote).toBeTruthy();
    expect(result.status.traits).toHaveLength(3);
    expect(result.status.suitable).toHaveLength(3);
    expect(result.status.avoid).toHaveLength(3);
  });

  it("gives every status the expanded report content structure", () => {
    todayStatusTypes.forEach((status, index) => {
      expect(status.id).toBe(`status-${index + 1}`);
      expect(status.resultTitle).toBeTruthy();
      expect(status.shortDesc).toBeTruthy();
      expect(status.traits).toHaveLength(3);
      expect(status.deepAnalysis.length).toBeGreaterThanOrEqual(250);
      expect(status.deepAnalysis.length).toBeLessThanOrEqual(400);
      expect(status.influences.length).toBeGreaterThanOrEqual(3);
      expect(status.influences.length).toBeLessThanOrEqual(5);
      expect(status.suitable).toHaveLength(3);
      expect(status.avoid).toHaveLength(3);
      expect(status.quote).toBeTruthy();
      expect(status.funComment).toBeTruthy();
      expect(status.appReason).toContain("人生档案");
    });
  });

  it("deepens the high frequency female user status reports", () => {
    const highFrequencyStatusNames = [
      "关系敏感期",
      "低耗保护期",
      "情绪整理期",
      "安全感缺口期",
      "回应需求期",
      "边界修复期",
      "自我怀疑期",
      "行动蓄力期",
    ];

    highFrequencyStatusNames.forEach((name) => {
      const status = todayStatusTypes.find((item) => item.name === name);

      expect(status).toBeTruthy();
      expect(status?.deepAnalysis.length).toBeGreaterThanOrEqual(250);
      expect(status?.deepAnalysis.length).toBeLessThanOrEqual(400);
      expect(status?.deepAnalysis).toMatch(/情绪|关系|压力|安全感|边界|价值|能量|内耗|防御|回应/);
    });
  });

  it("uses the highest and second highest dimensions to vary status pools", () => {
    const actionRecovery = calculateTodayStatusResult(["C", "C", "C", "C", "C", "C", "A", "A", "A", "A"]);

    expect(actionRecovery.primaryDimension).toBe("action");
    expect(actionRecovery.secondaryDimension).toBe("recovery");
    expect(["行动蓄力期", "压力转化期", "节奏重建期"]).toContain(actionRecovery.status.name);
  });

  it("varies results for different answer fingerprints within the same dimension pair", () => {
    const answerSets = [
      ["C", "C", "C", "C", "C", "C", "A", "A", "A", "A"],
      ["C", "A", "C", "A", "C", "A", "C", "A", "C", "C"],
      ["A", "C", "C", "C", "A", "C", "A", "C", "A", "C"],
    ] as TestOptionKey[][];

    const results = answerSets.map(calculateTodayStatusResult);
    const statusNames = new Set(results.map((result) => result.status.name));

    results.forEach((result) => {
      expect(result.primaryDimension).toBe("action");
      expect(result.secondaryDimension).toBe("recovery");
    });
    expect(statusNames.size).toBeGreaterThan(1);
  });

  it("keeps the same answers stable across repeated calculations", () => {
    const answers = ["B", "C", "B", "C", "B", "C", "B", "C", "A", "D"] as TestOptionKey[];
    const first = calculateTodayStatusResult(answers);
    const second = calculateTodayStatusResult(answers);

    expect(second.status.id).toBe(first.status.id);
    expect(second.primaryDimension).toBe(first.primaryDimension);
    expect(second.secondaryDimension).toBe(first.secondaryDimension);
  });

  it("exports the requested localStorage keys", () => {
    expect(AURA_TODAY_TEST_ANSWERS_KEY).toBe("auraTodayTestAnswers");
    expect(AURA_TODAY_TEST_RESULT_KEY).toBe("auraTodayTestResult");
    expect(AURA_TODAY_TEST_DATE_KEY).toBe("auraTodayTestDate");
  });
});
