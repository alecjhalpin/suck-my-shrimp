"use client";
import { FormEvent, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
type Status = "idle" | "loading" | "success" | "duplicate" | "error";
export function LaunchForm() {
  const [email, setEmail] = useState(""); const [status, setStatus] = useState<Status>("idle");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setStatus("loading"); try { const response = await fetch("/api/launch-list", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); const data = (await response.json()) as { duplicate?: boolean }; if (!response.ok) throw new Error("Unable to join"); setStatus(data.duplicate ? "duplicate" : "success"); setEmail(""); } catch { setStatus("error"); } }
  return <div className="form-wrap"><form onSubmit={submit} className="launch-form"><label htmlFor="email">Email address</label><div className="input-row"><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@somewhere.com" value={email} onChange={(event) => { setEmail(event.target.value); setStatus("idle"); }} /><button type="submit" disabled={status === "loading"}>{status === "loading" ? <LoaderCircle className="spin" aria-label="Joining"/> : <>Join the list <ArrowRight size={20}/></>}</button></div></form><div className="form-status" aria-live="polite">{status === "success" && "You’re in. Keep an eye on your inbox."}{status === "duplicate" && "You’re already on the boat. We’ve got you."}{status === "error" && "That one got away. Try again in a moment."}{status === "idle" && "Launch news only. No spammy nonsense."}</div></div>;
}
