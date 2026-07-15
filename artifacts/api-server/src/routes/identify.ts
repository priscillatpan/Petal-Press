import { Router, type IRouter } from "express";
import sharp from "sharp";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const PLANTNET_API = "https://my-api.plantnet.org/v2/identify/all";

router.post("/identify", async (req, res) => {
  const apiKey = process.env.PLANTNET_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "PLANTNET_API_KEY not configured" });
    return;
  }

  const imageBase64: string | undefined = req.body?.image;
  if (!imageBase64) {
    res.status(400).json({ error: "No image provided" });
    return;
  }

  try {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const inputBuffer = Buffer.from(base64Data, "base64");

    // Normalise to JPEG — handles HEIC/HEIF from iPhone, WebP, PNG, etc.
    const jpegBuffer = await sharp(inputBuffer)
      .rotate()
      .jpeg({ quality: 85 })
      .toBuffer();

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(jpegBuffer)], { type: "image/jpeg" });
    formData.append("images", blob, "flower.jpg");
    formData.append("organs", "flower");

    const response = await fetch(
      `${PLANTNET_API}?api-key=${apiKey}&lang=en&nb-results=5`,
      { method: "POST", body: formData }
    );

    if (!response.ok) {
      const text = await response.text();
      logger.error({ status: response.status, body: text }, "PlantNet API error");
      res.status(response.status).json({ error: "Plant identification failed", detail: text });
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

    res.json({ results });
  } catch (err) {
    logger.error({ err }, "Failed to call PlantNet");
    res.status(500).json({ error: "Failed to identify plant" });
  }
});

export default router;
