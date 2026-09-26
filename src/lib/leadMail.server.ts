import { siteConfig } from "@/config/site";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
export type Row = [string, string | number | boolean | null | undefined, (string | undefined)?];

export const FOOTER = "Bavaria Autoarena GmbH · Gewerbestraße 7 · 94368 Perkam · Geschäftsführer: [[PLATZHALTER]] · Sitz: Perkam · Amtsgericht Straubing, HRB [[PLATZHALTER]] · USt-IdNr. [[PLATZHALTER]] · Diese E-Mail bestätigt den Eingang Ihrer Anfrage und stellt kein verbindliches Angebot dar.";

const fmt = (v: Row[1]) => (v === true ? "Ja" : v === false ? "Nein" : v == null || v === "" ? "–" : String(v));

export function renderMail(opts: { heading: string; intro: string[]; rows: Row[]; cta?: { href: string; label: string }; origin: string }) {
  const privacy = `${opts.origin}/datenschutz`;
  const table = opts.rows.map(([k, v, href]) => `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;color:#141A26">${href ? `<a href="${esc(href)}" style="color:#A8863E">${esc(fmt(v))}</a>` : esc(fmt(v)).replace(/\n/g, "<br>")}</td></tr>`).join("");
  const html = `<!doctype html><html lang="de"><body style="margin:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:24px">
<div style="background:#141A26;padding:18px 24px;border-bottom:3px solid #C9A961"><span style="color:#C9A961;font-size:11px;letter-spacing:4px">BAVARIA</span><br><span style="color:#B8BEC7;font-size:22px;font-weight:bold">AUTO</span><span style="color:#C9A961;font-size:22px;font-weight:bold">ARENA</span></div>
<h1 style="font-size:20px;color:#141A26;margin:24px 0 12px">${esc(opts.heading)}</h1>
${opts.intro.map((p) => `<p style="font-size:14px;line-height:1.6;color:#141A26;margin:0 0 12px">${esc(p)}</p>`).join("")}
<table style="font-size:14px;border-collapse:collapse;margin:12px 0 20px">${table}</table>
${opts.cta ? `<p><a href="${esc(opts.cta.href)}" style="display:inline-block;background:#C9A961;color:#141A26;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">${esc(opts.cta.label)}</a></p>` : ""}
<hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 12px">
<p style="font-size:11px;line-height:1.5;color:#6b7280">${esc(FOOTER)}<br><a href="${privacy}" style="color:#6b7280">Datenschutzerklärung</a></p>
</div></body></html>`;
  const text = [opts.heading, "", ...opts.intro, "", ...opts.rows.map(([k, v]) => `${k}: ${fmt(v)}`), ...(opts.cta ? ["", `${opts.cta.label}: ${opts.cta.href}`] : []), "", "--", FOOTER, `Datenschutz: ${privacy}`].join("\n");
  return { html, text };
}

export const dealerContactRows = (): Row[] => [
  ["Telefon", siteConfig.phone, `tel:${siteConfig.phone.replace(/\s/g, "")}`],
  ["E-Mail", siteConfig.email, `mailto:${siteConfig.email}`],
  ["Adresse", `${siteConfig.street}, ${siteConfig.zip} ${siteConfig.city}`],
];

/** Sends via Resend. Keys starting with "re_" go direct, otherwise through the Lovable connector gateway. */
export async function sendResend(key: string, msg: { from: string; to: string; subject: string; html: string; text: string; reply_to?: string }) {
  const direct = key.startsWith("re_");
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const url = direct ? "https://api.resend.com/emails" : "https://connector-gateway.lovable.dev/resend/emails";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (direct) headers["Authorization"] = `Bearer ${key}`;
  else { headers["Authorization"] = `Bearer ${lovableKey ?? ""}`; headers["X-Connection-Api-Key"] = key; }
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ ...msg, to: [msg.to] }) });
  if (!res.ok) throw new Error(`resend_${res.status}`);
}
