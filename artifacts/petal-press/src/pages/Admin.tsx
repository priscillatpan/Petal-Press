import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";

type Row = { email: string; signedUpAt: string; lastSignInAt: string | null; flowerCount: number };
type Stats = { totalUsers: number; totalFlowers: number; users: Row[] };

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      if (!supabase) {
        setError("Not available in this environment");
        setLoading(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Not signed in");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/admin-stats", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({} as { error?: string }));
          throw new Error(body.error || `Server error ${res.status}`);
        }
        setStats(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen px-5 py-8" style={{ backgroundColor: "#FAF7EF", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <Link href="/garden">
          <span style={{ fontSize: "13px", color: "#9A8F7F", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            ← back to garden
          </span>
        </Link>

        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "26px", color: "#2C2721", marginTop: "16px", marginBottom: "24px" }}>
          Dashboard
        </h1>

        {loading && (
          <p style={{ fontSize: "14px", color: "#9A8F7F" }}>Loading…</p>
        )}

        {!loading && error && (
          <p style={{ fontSize: "14px", color: "#B25050" }}>{error}</p>
        )}

        {!loading && stats && (
          <>
            <div className="flex gap-3 mb-8">
              <div className="flex-1 rounded-2xl p-4" style={{ backgroundColor: "#FFFDF5", border: "1px solid #E8DCC0" }}>
                <p style={{ fontSize: "11px", color: "#9A8F7F", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Users
                </p>
                <p style={{ fontFamily: "Fraunces, serif", fontSize: "28px", color: "#2C2721" }}>{stats.totalUsers}</p>
              </div>
              <div className="flex-1 rounded-2xl p-4" style={{ backgroundColor: "#FFFDF5", border: "1px solid #E8DCC0" }}>
                <p style={{ fontSize: "11px", color: "#9A8F7F", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Flowers pressed
                </p>
                <p style={{ fontFamily: "Fraunces, serif", fontSize: "28px", color: "#2C2721" }}>{stats.totalFlowers}</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E8DCC0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#EDE5D0", textAlign: "left" }}>
                    <th style={{ padding: "10px 12px", color: "#3D362D", fontWeight: 500 }}>Email</th>
                    <th style={{ padding: "10px 12px", color: "#3D362D", fontWeight: 500 }}>Signed up</th>
                    <th style={{ padding: "10px 12px", color: "#3D362D", fontWeight: 500, textAlign: "right" }}>Flowers</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.users.map((u) => (
                    <tr key={u.email} style={{ borderTop: "1px solid #E8DCC0" }}>
                      <td style={{ padding: "10px 12px", color: "#3D362D" }}>{u.email}</td>
                      <td style={{ padding: "10px 12px", color: "#736959" }}>{formatDate(u.signedUpAt)}</td>
                      <td style={{ padding: "10px 12px", color: "#736959", textAlign: "right" }}>{u.flowerCount}</td>
                    </tr>
                  ))}
                  {stats.users.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: "16px 12px", color: "#9A8F7F", textAlign: "center" }}>
                        No users yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
