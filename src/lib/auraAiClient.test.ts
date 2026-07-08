import { describe, expect, it } from "vitest";
import { chatJson } from "./auraAiClient";

describe("aura AI client", () => {
  it("returns null when API key is missing", async () => {
    const previousKey = process.env.AURA_AI_API_KEY;
    delete process.env.AURA_AI_API_KEY;

    const result = await chatJson({
      systemPrompt: "Return JSON.",
      userPrompt: "Return {\"ok\":true}",
    });

    expect(result).toBeNull();

    if (previousKey) {
      process.env.AURA_AI_API_KEY = previousKey;
    }
  });
});
