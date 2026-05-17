import { Router, type IRouter } from "express";
import { createClient } from "@supabase/supabase-js";
import { generateImageBuffer } from "@workspace/integrations-openai-ai-server/image";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function getSupabase() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key);
}

function latinToSlug(latinName: string): string {
  return latinName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

router.post("/illustrate", async (req, res) => {
  const { latinName, commonName, force } = req.body as { latinName?: string; commonName?: string; force?: boolean };

  if (!latinName || !commonName) {
    res.status(400).json({ error: "latinName and commonName are required" });
    return;
  }

  const slug = latinToSlug(latinName);
  // v2 = playful watercolor style; v1 = old formal botanical style
  const storagePath = `illustrations/v2/${slug}.png`;

  try {
    const supabase = getSupabase();

    // Return cached version unless force=true
    if (!force) {
      const { data: existing } = await supabase.storage
        .from("flower-images")
        .list("illustrations/v2", { search: `${slug}.png` });

      if (existing && existing.length > 0) {
        const { data: urlData } = supabase.storage
          .from("flower-images")
          .getPublicUrl(storagePath);
        res.json({ illustrationUrl: urlData.publicUrl, cached: true });
        return;
      }
    }

    // Generate playful watercolor illustration
    const prompt =
      `Whimsical, joyful watercolor illustration of ${commonName} (${latinName}). ` +
      `Loose expressive brushwork, vivid botanical colors, soft washes with visible brushstrokes. ` +
      `Playful and charming, like a beloved illustrated nature book. ` +
      `Full plant shown — stem, leaves, and flowers. Pure white background. No text, no labels, no frames.`;

    logger.info({ latinName }, "Generating botanical illustration");
    const buffer = await generateImageBuffer(prompt, "1024x1024");

    // Upload to Supabase storage (new path = no overwrite conflict)
    const { error: uploadError } = await supabase.storage
      .from("flower-images")
      .upload(storagePath, buffer, { contentType: "image/png", upsert: false });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from("flower-images")
      .getPublicUrl(storagePath);

    logger.info({ latinName, storagePath }, "Illustration generated and cached");
    res.json({ illustrationUrl: urlData.publicUrl, cached: false });
  } catch (err) {
    logger.error({ err, latinName }, "Failed to generate illustration");
    res.status(500).json({ error: "Failed to generate illustration" });
  }
});

export default router;
