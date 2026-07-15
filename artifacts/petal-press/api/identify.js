const PLANTNET_API = "https://my-api.plantnet.org/v2/identify/all";

async function handler(req, res) {
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

  // Vercel pre-parses JSON bodies — req.body is already an object
  const imageBase64 = req.body?.image;
  if (!imageBase64) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "No image provided" }));
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

    const data = await response.json();
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

module.exports = handler;
module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};
