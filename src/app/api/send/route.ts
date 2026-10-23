import { EmailTemplate } from "@/components/email-template";
import { config } from "@/data/config";
import { Resend } from "resend";
import { z } from "zod";

const Email = z.object({
  fullName: z.string().trim().min(2, "Full name is invalid!").max(100),
  email: z.string().trim().email({ message: "Email is invalid!" }),
  message: z.string().trim().min(10, "Message is too short!").max(2000),
  // honeypot: real visitors never fill this in
  website: z.string().optional(),
});

// Best-effort limit per visitor (in memory, so per server instance): 5 messages / 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  for (const [k, v] of hits) {
    const fresh = v.filter((t) => now - t < WINDOW_MS);
    if (fresh.length) hits.set(k, fresh);
    else hits.delete(k);
  }
  const recent = hits.get(ip) ?? [];
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function POST(req: Request) {
  // only accept posts that come from this site's own pages
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) {
    return Response.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; contact form cannot send.");
    return Response.json({ error: "Email sending is not configured yet." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = Email.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const { fullName, email, message, website } = parsed.data;
  if (website) return Response.json({ ok: true });

  const resend = new Resend(apiKey);
  try {
    const { data, error } = await resend.emails.send({
      // the default sandbox sender only delivers to the Resend account owner;
      // set CONTACT_FROM to an address on a verified domain to reach config.email
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO || config.email],
      replyTo: email,
      subject: `Portfolio message from ${fullName}`,
      react: EmailTemplate({ fullName, email, message }),
    });

    if (error) {
      console.error("Resend rejected the message:", error.name, error.message);
      return Response.json({ error: "The message could not be delivered." }, { status: 502 });
    }
    return Response.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return Response.json({ error: "The message could not be delivered." }, { status: 500 });
  }
}
