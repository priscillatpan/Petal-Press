const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

type Req = {
  method: string;
  body: { commonName?: string; scientificName?: string; family?: string };
};
type Res = {
  status: (n: number) => { json: (o: unknown) => void };
  json: (o: unknown) => void;
};

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const { commonName, scientificName, family } = req.body ?? {};
  if (!commonName && !scientificName) {
    return res.status(400).json({ error: "No flower name provided" });
  }

  const prompt = `You are a floriography expert. Give me the traditional symbolic meaning and a poetic nickname for this flower:

Common name: ${commonName || "unknown"}
Scientific name: ${scientificName || "unknown"}
Family: ${family || "unknown"}

Reply with ONLY a JSON object in this exact format (no markdown, no explanation):
{"meaning": "2-5 symbolic meanings separated by commas", "nickname": "2-3 word poetic nickname"}

The meaning should be evocative and drawn from Victorian flower language or cultural symbolism. The nickname should be lyrical and feel like a secret name for the flower (like "Heart's Bloom" or "Wish-Maker").`;

  try {
    const response = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 128,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Claude error:", response.status, text);
      return res.status(response.status).json({ error: "AI meaning generation failed" });
    }

    const data = await response.json() as {
      content: Array<{ type: string; text: string }>;
    };

    const text = data.content?.[0]?.text?.trim() ?? "";
    const parsed = JSON.parse(text) as { meaning: string; nickname: string };

    return res.json({ meaning: parsed.meaning, nickname: parsed.nickname });
  } catch (err) {
    console.error("Failed to generate meaning:", err);
    return res.status(500).json({ error: "Failed to generate meaning" });
  }
}
