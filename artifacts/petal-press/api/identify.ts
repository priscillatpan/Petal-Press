export const config = {
  api: {
    bodyParser: {
      sizeLimit: "12mb",
    },
  },
};

const PLANTNET_API = "https://my-api.plantnet.org/v2/identify/all";

type Req = {
  method: string;
  body: { image?: string; mimeType?: string };
};
type Res = {
  status: (n: number) => { json: (o: unknown) => void };
  json: (o: unknown) => void;
};

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.PLANTNET_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "PLANTNET_API_KEY not configured" });
  }

  const { image, mimeType = "image/jpeg" } = req.body ?? {};
  if (!image) {
    return res.status(400).json({ error: "No image provided" });
  }

  try {
    const buffer = Buffer.from(image, "base64");
    const formData = new FormData();
    const blob = new Blob([buffer], { type: mimeType });
    formData.append("images", blob, "flower.jpg");
    formData.append("organs", "flower");

    const response = await fetch(
      `${PLANTNET_API}?api-key=${apiKey}&lang=en&nb-results=5`,
      { method: "POST", body: formData }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("PlantNet error:", response.status, text);
      return res.status(response.status).json({ error: "Plant identification failed", detail: text });
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

    return res.json({ results });
  } catch (err) {
    console.error("Failed to call PlantNet:", err);
    return res.status(500).json({ error: "Failed to identify plant" });
  }
}
