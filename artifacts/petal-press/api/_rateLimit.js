// Simple in-memory, per-function-instance rate limiter.
// Not perfectly accurate across cold starts or concurrent instances, but
// adds zero latency and no external dependency — enough to stop a runaway
// script or scraper from burning through the PlantNet/OpenAI quota without
// slowing down real requests.
const buckets = new Map();

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

export function rateLimit(req, { max, windowMs = 60_000 }) {
  const key = clientIp(req);
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.start > windowMs) {
    buckets.set(key, { start: now, count: 1 });
    return { limited: false };
  }

  bucket.count += 1;
  if (bucket.count > max) {
    return { limited: true, retryAfter: Math.ceil((bucket.start + windowMs - now) / 1000) };
  }
  return { limited: false };
}
