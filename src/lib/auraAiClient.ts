type ChatJsonOptions = {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
};

function extractJson(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const candidate = fenced?.[1] ?? trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start < 0 || end < start) return null;

  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function chatJson<T = unknown>({
  systemPrompt,
  userPrompt,
  temperature = 0.7,
  maxTokens = 1800,
}: ChatJsonOptions): Promise<T | null> {
  const apiKey = process.env.AURA_AI_API_KEY;
  const baseUrl = process.env.AURA_AI_BASE_URL || "https://api.deepseek.com";
  const model = process.env.AURA_AI_MODEL || "deepseek-chat";

  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: `${systemPrompt}\n只输出可解析 JSON，不要输出 Markdown。` },
          { role: "user", content: userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") return null;

    return extractJson(content) as T | null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
