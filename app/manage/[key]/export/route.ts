import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

type Signup = { email: string; source: string; created_at: string };

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const bindings = env as unknown as { ADMIN_PATH_KEY?: string; DB?: D1Database };
  if (!bindings.ADMIN_PATH_KEY || key.length < 24 || key !== bindings.ADMIN_PATH_KEY) {
    return new Response("Not found", { status: 404 });
  }
  if (!bindings.DB) return new Response("Database unavailable", { status: 503 });

  const result = await bindings.DB
    .prepare("SELECT email, source, created_at FROM launch_signups ORDER BY created_at DESC")
    .all<Signup>();
  const rows = result.results ?? [];
  const csv = [
    "email,source,created_at",
    ...rows.map((row) => [row.email, row.source, row.created_at].map(csvCell).join(",")),
  ].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="suck-my-shrimp-launch-list-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}
