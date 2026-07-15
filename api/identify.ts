import type { IncomingMessage, ServerResponse } from "http";

const PLANTNET_API = "https://my-api.plantnet.org/v2/identify/all";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const apiKey = process.env.PLANTNET_API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "PLANTNET_API_KEY not configured" }));
    return;
  }

  let body = "";
  for await (const chunk of req) body += chunk;

  let imageBase64: string;
  try {
    const parsed = JSON.parse(body) as { image?: string };
    if (!parsed.image) throw new Error("missing image");
    imageBase64 = parsed.image;
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid request body" }));
    return;
  }

  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  try {
    const formData = new FormData();
    const blob = new Blob([buffer], { type: "image/jpeg" });
    formData.append("images", blob, "flower.jpg");
    formData.append("organs", "flower");

    const response = await fetch(
      `${PLANTNET_API}?api-key=${apiKey}&lang=en&nb-results=5`,
      { method: "POST", body: formData }
    );

    if (!response.ok) {
      const text = await response.text();
      res.statusCode = response.status;
      res.end(JSON.stringify({ error: "Plant identification failed", detail: text }));
      return;
    }

    const data = await response.json() as {
      results: Array<{
        score: number;
        species: {
          scientificNameWithoutAuthor: string;
          commonNames: string[];
          family: { scientificNameWithoutAuthor: string };
        };
      }>;
    };

    const results = (data.results || []).slice(0, 5).map(r => ({
      score: Math.round(r.score * 100),
      scientificName: r.species.scientificNameWithoutAuthor,
      commonName: r.species.commonNames?.[0] || r.species.scientificNameWithoutAuthor,
      family: r.species.family?.scientificNameWithoutAuthor || "",
    }));

    res.statusCode = 200;
    res.end(JSON.stringify({ results }));
  } catch (err) {
    console.error("PlantNet error:", err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Failed to identify plant" }));
  }
}
