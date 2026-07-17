import { rateLimit } from "./_rateLimit.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { limited, retryAfter } = rateLimit(req, { max: 30, windowMs: 60_000 });
  if (limited) {
    res.setHeader("Retry-After", String(retryAfter));
    return res.status(429).json({ error: "Too many requests — please wait a moment and try again." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!supabaseUrl || !serviceKey || !adminEmail) {
    return res.status(500).json({ error: "Admin stats not configured" });
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) {
    return res.status(401).json({ error: "Not signed in" });
  }

  // Verify who's actually calling, using their own session token
  const callerRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${token}` },
  });
  if (!callerRes.ok) {
    return res.status(401).json({ error: "Invalid session" });
  }
  const caller = await callerRes.json();
  if ((caller?.email || "").toLowerCase() !== adminEmail.toLowerCase()) {
    return res.status(403).json({ error: "Not authorized" });
  }

  try {
    // List all users — requires the service role key, bypasses RLS by design
    const usersRes = await fetch(`${supabaseUrl}/auth/v1/admin/users?per_page=1000`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    if (!usersRes.ok) {
      const detail = await usersRes.text();
      return res.status(502).json({ error: "Failed to fetch users", detail });
    }
    const { users } = await usersRes.json();

    // Flower counts per user
    const flowersRes = await fetch(`${supabaseUrl}/rest/v1/flowers?select=user_id`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    const flowerRows = flowersRes.ok ? await flowersRes.json() : [];

    const countsByUser = {};
    for (const row of flowerRows) {
      countsByUser[row.user_id] = (countsByUser[row.user_id] || 0) + 1;
    }

    const rows = (users || [])
      .map((u) => ({
        email: u.email,
        signedUpAt: u.created_at,
        lastSignInAt: u.last_sign_in_at || null,
        flowerCount: countsByUser[u.id] || 0,
      }))
      .sort((a, b) => new Date(b.signedUpAt).getTime() - new Date(a.signedUpAt).getTime());

    return res.status(200).json({
      totalUsers: rows.length,
      totalFlowers: flowerRows.length,
      users: rows,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return res.status(500).json({ error: "Failed to load stats" });
  }
}
