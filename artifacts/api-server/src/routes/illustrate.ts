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
  const { latinName, commonName } = req.body as { latinName?: string; commonName?: string };

  if (!latinName || !commonName) {
    res.status(400).json({ error: "latinName and commonName are required" });
    return;
  }

  const slug = latinToSlug(latinName);
  const storagePath = `illustrations/${slug}.png`;

  try {
    const supabase = getSupabase();

    // Check if illustration already cached in Supabase storage
    const { data: existing } = await supabase.storage
      .from("flower-images")
      .list("illustrations", { search: `${slug}.png` });

    if (existing && existing.length > 0) {
      const { data: urlData } = supabase.storage
        .from("flower-images")
        .getPublicUrl(storagePath);
      res.json({ illustrationUrl: urlData.publicUrl, cached: true });
      return;
    }

    // Generate botanical watercolor illustration
    const prompt =
      `Vintage botanical watercolor illustration of ${commonName} (${latinName}). ` +
      `19th century scientific botanical print style, detailed and botanically accurate. ` +
      `Shows stem, leaves, and flowers in soft watercolor technique. ` +
      `Cream parchment background. No text, no labels, no borders.`;

    logger.info({ latinName }, "Generating botanical illustration");
    const buffer = await generateImageBuffer(prompt, "1024x1024");

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("flower-images")
      .upload(storagePath, buffer, { contentType: "image/png", upsert: true });

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
