import { env } from "cloudflare:workers";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RuntimeEnv = {
  DB?: D1Database;
  RESEND_API_KEY?: string;
};

async function sendWelcomeEmail(email: string, apiKey: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `launch-welcome-${email}`,
    },
    body: JSON.stringify({
      from: "Suck My Shrimp <crew@updates.suckmyshrimp.com>",
      to: [email],
      subject: "You’re on the hook 🦐",
      text: [
        "YOU’RE ON THE HOOK",
        "",
        "You’ve officially joined the Suck My Shrimp launch list.",
        "We’ll let you know when the first drop hits the water.",
        "",
        "Until then, keep your rod ready.",
        "",
        "Suck My Shrimp",
        "Saltwater gear with an attitude.",
        "",
        "You received this because you joined the launch list at suckmyshrimp.com.",
      ].join("\n"),
      html: `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#041c30;color:#fff2d2;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#041c30;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#082b49;border:2px solid #55d3c5;">
            <tr>
              <td style="padding:42px 36px 12px;text-align:center;">
                <div style="color:#55d3c5;font-size:12px;font-weight:800;letter-spacing:3px;text-transform:uppercase;">Suck My Shrimp</div>
                <div style="margin-top:18px;font-size:64px;line-height:1;">🦐</div>
                <h1 style="margin:16px 0 0;color:#fff2d2;font-size:38px;line-height:1;text-transform:uppercase;">You’re on the hook.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 36px 38px;text-align:center;">
                <p style="margin:0;color:#c4ded9;font-size:18px;line-height:1.6;">You’ve officially joined the Suck My Shrimp launch list. We’ll let you know when the first drop hits the water.</p>
                <p style="margin:24px 0 0;color:#ff5a36;font-size:18px;font-weight:800;">Until then, keep your rod ready.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;background:#ff5a36;color:#ffffff;text-align:center;font-size:12px;letter-spacing:1px;text-transform:uppercase;">
                Saltwater gear with an attitude
              </td>
            </tr>
          </table>
          <p style="max-width:600px;margin:16px auto 0;color:#7fa7a6;font-size:11px;line-height:1.5;text-align:center;">You received this because you joined the launch list at suckmyshrimp.com.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend returned ${response.status}: ${detail}`);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { email?: unknown };
    const email =
      typeof payload.email === "string"
        ? payload.email.trim().toLowerCase()
        : "";

    if (!emailPattern.test(email) || email.length > 254) {
      return Response.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const bindings = env as unknown as RuntimeEnv;
    if (!bindings.DB) {
      return Response.json(
        { error: "Launch list is temporarily unavailable." },
        { status: 503 }
      );
    }

    const result = await bindings.DB.prepare(
      "INSERT OR IGNORE INTO launch_signups (email, source) VALUES (?, ?)"
    )
      .bind(email, "homepage")
      .run();

    const duplicate = result.meta.changes === 0;

    if (!duplicate && bindings.RESEND_API_KEY) {
      try {
        await sendWelcomeEmail(email, bindings.RESEND_API_KEY);
      } catch (error) {
        console.error("launch-list confirmation email failed", error);
      }
    } else if (!duplicate) {
      console.error("launch-list confirmation email skipped: RESEND_API_KEY missing");
    }

    return Response.json(
      { ok: true, duplicate },
      { status: duplicate ? 200 : 201 }
    );
  } catch (error) {
    console.error("launch-list signup failed", error);
    return Response.json(
      { error: "Launch list is temporarily unavailable." },
      { status: 500 }
    );
  }
}
