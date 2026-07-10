import { createClient } from "@supabase/supabase-js";

const OPENAI_API = "https://api.openai.com/v1/chat/completions";

type Req = {
  method: string;
  body: { commonName?: string; scientificName?: string; family?: string };
};
type Res = {
  status: (n: number) => { json: (o: unknown) => void };
  json: (o: unknown) => void;
};

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch (err) {
    console.error("Failed to create Supabase client:", err);
    return null;
  }
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  const { commonName, scientificName, family } = req.body ?? {};
  if (!commonName && !scientificName) {
    return res.status(400).json({ error: "No flower name provided" });
  }

  const cacheKey = (scientificName || commonName || "").trim().toLowerCase();
  const supabase = getSupabase();

  // 1. Check the shared cache first — avoids paying for species we've already looked up
  if (supabase && cacheKey) {
    try {
      const { data } = await supabase
        .from("flower_meanings")
        .select("meaning, nickname, theme")
        .eq("scientific_name", cacheKey)
        .maybeSingle();

      if (data) {
        return res.json({ meaning: data.meaning, nickname: data.nickname, theme: data.theme });
      }
    } catch (err) {
      console.error("Cache lookup failed, continuing to AI:", err);
    }
  }

  const THEME_KEYS = [
    "love", "new-beginnings", "remembrance", "joy", "strength",
  ];

  const prompt = `You are a floriography expert. Give me the traditional symbolic meaning, a poetic nickname, and a single theme category for this flower:

Common name: ${commonName || "unknown"}
Scientific name: ${scientificName || "unknown"}
Family: ${family || "unknown"}

Reply with ONLY a JSON object in this exact format (no markdown, no explanation):
{"meaning": "2-5 symbolic meanings separated by commas", "nickname": "2-3 word poetic nickname", "theme": "one of: ${THEME_KEYS.join(", ")}"}

The meaning should be evocative and drawn from Victorian flower language or cultural symbolism. The nickname should be lyrical and feel like a secret name for the flower (like "Heart's Bloom" or "Wish-Maker"). The theme MUST be exactly one of the listed keys, chosen as whichever best fits the meaning — never invent a new one.`;

  try {
    const response = await fetch(OPENAI_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 128,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI error:", response.status, text);
      return res.status(response.status).json({ error: "AI meaning generation failed" });
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string } }>;
    };

    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    const parsed = JSON.parse(text) as { meaning: string; nickname: string; theme?: string };
    const theme = THEME_KEYS.includes(parsed.theme ?? "") ? parsed.theme : "joy";

    // 2. Save to the shared cache so future lookups of this species are free
    if (supabase && cacheKey) {
      try {
        await supabase.from("flower_meanings").upsert({
          scientific_name: cacheKey,
          common_name: commonName || null,
          meaning: parsed.meaning,
          nickname: parsed.nickname,
          theme,
        });
      } catch (err) {
        console.error("Failed to write cache entry:", err);
      }
    }

    return res.json({ meaning: parsed.meaning, nickname: parsed.nickname, theme });
  } catch (err) {
    console.error("Failed to generate meaning:", err);
    return res.status(500).json({ error: "Failed to generate meaning" });
  }
}
