const OPENAI_API = "https://api.openai.com/v1/chat/completions";

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export default async function handler(req, res) {
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
  const sb = supabaseConfig();

  // 1. Check the shared cache first — avoids paying for species we've already looked up
  if (sb && cacheKey) {
    try {
      const cacheRes = await fetch(
        `${sb.url}/rest/v1/flower_meanings?scientific_name=eq.${encodeURIComponent(cacheKey)}&select=meaning,nickname&limit=1`,
        { headers: { apikey: sb.key, Authorization: `Bearer ${sb.key}` } }
      );
      if (cacheRes.ok) {
        const rows = await cacheRes.json();
        if (rows[0]) {
          return res.json({ meaning: rows[0].meaning, nickname: rows[0].nickname });
        }
      }
    } catch (err) {
      console.error("Cache lookup failed, continuing to AI:", err);
    }
  }

  const prompt = `You are a floriography expert. Give me the traditional symbolic meaning and a poetic nickname for this flower:

Common name: ${commonName || "unknown"}
Scientific name: ${scientificName || "unknown"}
Family: ${family || "unknown"}

Reply with ONLY a JSON object in this exact format (no markdown, no explanation):
{"meaning": "2-5 symbolic meanings separated by commas", "nickname": "2-3 word poetic nickname"}

The meaning should be evocative and drawn from Victorian flower language or cultural symbolism. The nickname should be lyrical and feel like a secret name for the flower (like "Heart's Bloom" or "Wish-Maker").`;

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

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    const parsed = JSON.parse(text);

    // 2. Save to the shared cache so future lookups of this species are free
    if (sb && cacheKey) {
      try {
        await fetch(`${sb.url}/rest/v1/flower_meanings?on_conflict=scientific_name`, {
          method: "POST",
          headers: {
            apikey: sb.key,
            Authorization: `Bearer ${sb.key}`,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify({
            scientific_name: cacheKey,
            common_name: commonName || null,
            meaning: parsed.meaning,
            nickname: parsed.nickname,
          }),
        });
      } catch (err) {
        console.error("Failed to write cache entry:", err);
      }
    }

    return res.json({ meaning: parsed.meaning, nickname: parsed.nickname });
  } catch (err) {
    console.error("Failed to generate meaning:", err);
    return res.status(500).json({ error: "Failed to generate meaning" });
  }
}
