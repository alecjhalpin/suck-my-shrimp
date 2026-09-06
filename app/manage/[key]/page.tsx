import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import { notFound } from "next/navigation";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Launch List",
  robots: { index: false, follow: false, nocache: true },
};

type Signup = {
  id: number;
  email: string;
  source: string;
  created_at: string;
};

function validKey(key: string) {
  const configured = (env as unknown as { ADMIN_PATH_KEY?: string }).ADMIN_PATH_KEY;
  return Boolean(configured && key.length >= 24 && key === configured);
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  if (!validKey(key)) notFound();

  const database = (env as unknown as { DB?: D1Database }).DB;
  if (!database) throw new Error("D1 binding DB is unavailable.");

  const result = await database
    .prepare(
      "SELECT id, email, source, created_at FROM launch_signups ORDER BY created_at DESC"
    )
    .all<Signup>();
  const signups = result.results ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = signups.filter((row) => row.created_at.startsWith(today)).length;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Private dashboard</p>
            <h1 className={styles.title}>Launch List</h1>
          </div>
          <a className={styles.export} href={`/manage/${key}/export`}>
            Download CSV
          </a>
        </header>

        <section className={styles.stats} aria-label="Signup summary">
          <div className={styles.stat}><span>Total signups</span><strong>{signups.length}</strong></div>
          <div className={styles.stat}><span>Today</span><strong>{todayCount}</strong></div>
        </section>

        <section className={styles.panel}>
          {signups.length ? (
            <table className={styles.table}>
              <thead><tr><th>Email</th><th>Source</th><th>Joined</th></tr></thead>
              <tbody>
                {signups.map((signup) => (
                  <tr key={signup.id}>
                    <td>{signup.email}</td>
                    <td>{signup.source}</td>
                    <td>{new Date(`${signup.created_at}Z`).toLocaleString("en-US", { timeZone: "America/New_York" })} ET</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className={styles.empty}>No signups yet.</p>}
        </section>
        <p className={styles.note}>Protected by Cloudflare Access. This page is excluded from search indexing and public navigation.</p>
      </div>
    </main>
  );
}
