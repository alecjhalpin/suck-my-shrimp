import { env } from "cloudflare:workers";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { email?: unknown };
    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
    if (!emailPattern.test(email) || email.length > 254) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    if (!env.DB) return Response.json({ error: "Launch list is temporarily unavailable." }, { status: 503 });
    const result = await env.DB.prepare("INSERT OR IGNORE INTO launch_signups (email, source) VALUES (?, ?)").bind(email, "homepage").run();
    return Response.json({ ok: true, duplicate: result.meta.changes === 0 }, { status: result.meta.changes === 0 ? 200 : 201 });
  } catch (error) { console.error("launch-list signup failed", error); return Response.json({ error: "Launch list is temporarily unavailable." }, { status: 500 }); }
}
