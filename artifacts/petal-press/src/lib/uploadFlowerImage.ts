import { supabase } from "@/lib/supabase";

async function resizeFileToBlob(file: File, maxPx = 1200, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > maxPx || h > maxPx) {
        if (w > h) { h = Math.round((h / w) * maxPx); w = maxPx; }
        else { w = Math.round((w / h) * maxPx); h = maxPx; }
      }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d", { colorSpace: "srgb" })!.drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Resize failed")), "image/jpeg", quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

// Resizes the image, uploads it to Supabase Storage, and returns its public URL.
// Returns "" if Supabase isn't configured or the upload/processing fails.
export async function uploadFlowerImage(file: File): Promise<string> {
  if (!supabase) return "";
  try {
    const uploadBlob = await resizeFileToBlob(file).catch(() => file);
    const path = `${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("flower-images")
      .upload(path, uploadBlob, { contentType: "image/jpeg", upsert: false });

    if (uploadError) {
      console.error("Image upload failed:", uploadError.message);
      return "";
    }
    const { data } = supabase.storage.from("flower-images").getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error("Image processing failed:", err);
    return "";
  }
}
