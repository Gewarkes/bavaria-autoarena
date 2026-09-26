import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
const bodySchema = z.object({ type: z.enum(["trade_in", "inquiry"]), id: z.string().uuid() });

const INTENT: Record<string, string> = { inzahlung: "Inzahlungnahme", verkaufen: "Verkaufen", bewerten: "Nur bewerten" };
const KIND: Record<string, string> = { probefahrt: "Probefahrt", anfrage: "Anfrage", rueckruf: "Rückruf", finanzierung: "Finanzierung", kontakt: "Kontakt" };

export const Route = createFileRoute("/api/public/send-lead-mail")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return json({ sent: false, error: "invalid" }, 400);
        const { type, id } = parsed.data;
        const key = process.env["RESEND_API_KEY"];
        if (!key) { console.log("mail skipped: no RESEND_API_KEY", id); return json({ sent: false }); }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { renderMail, sendResend, dealerContactRows } = await import("@/lib/leadMail.server");
        const origin = process.env["SITE_URL"] || new URL(request.url).origin;
        const table = type === "trade_in" ? "trade_in_requests" : "inquiries";
        const since = new Date(Date.now() - 2 * 3600_000).toISOString();

        // Claim: only once per ID and only for fresh leads
        const { data: claimed } = await supabaseAdmin.from(table).update({ notified_at: new Date().toISOString() })
          .eq("id", id).is("notified_at", null).gt("created_at", since).select("id");
        if (!claimed?.length) { console.log("mail skipped: already notified or unknown", id); return json({ sent: false }); }

        let dealerSubject: string, rows: [string, string | number | boolean | null | undefined, (string | undefined)?][], adminPath: string, email: string | null, salutation: string, summary: [string, string | number | boolean | null | undefined][];
        if (type === "trade_in") {
          const { data: r } = await supabaseAdmin.from("trade_in_requests").select("*").eq("id", id).single();
          if (!r) return json({ sent: false });
          const car = `${r.brand} ${r.model} ${r.first_registration_year}`;
          dealerSubject = `Neue Inzahlungnahme-Anfrage: ${car} – ${r.first_name} ${r.last_name}`;
          adminPath = `/admin/inzahlungnahme/${id}`;
          email = r.email; salutation = `Guten Tag ${r.first_name} ${r.last_name},`;
          summary = [["Fahrzeug", car], ["Kilometerstand", `${r.mileage_km.toLocaleString("de-DE")} km`], ["Anliegen", INTENT[r.intent] ?? r.intent]];
          rows = [["Name", `${r.first_name} ${r.last_name}`], ["Telefon", r.phone, r.phone ? `tel:${r.phone}` : undefined], ["E-Mail", r.email, r.email ? `mailto:${r.email}` : undefined],
            ["PLZ", r.zip], ["Kontaktweg", r.contact_channel], ["Fahrzeug", car], ["Kilometer", `${r.mileage_km.toLocaleString("de-DE")} km`], ["Kraftstoff", r.fuel], ["Getriebe", r.transmission],
            ["Variante", r.engine_variant], ["Unfallstatus", r.accident_status], ["Anliegen", INTENT[r.intent] ?? r.intent], ["Finanzierung aktiv", r.financing_active], ["Werbekontakt", r.marketing_opt_in]];
        } else {
          const { data: r } = await supabaseAdmin.from("inquiries").select("*, vehicles(title, slug)").eq("id", id).single();
          if (!r) return json({ sent: false });
          const v = r.vehicles as { title: string; slug: string } | null;
          const kind = KIND[r.kind] ?? r.kind;
          dealerSubject = `Neue Fahrzeuganfrage: ${kind} – ${v?.title ?? "allgemein"}`;
          adminPath = `/admin/anfragen?id=${id}`;
          email = r.email; salutation = `Guten Tag ${r.name},`;
          summary = [["Art", kind], ["Fahrzeug", v?.title ?? "–"], ["Nachricht", r.message]];
          rows = [["Art", kind], ["Name", r.name], ["Telefon", r.phone, r.phone ? `tel:${r.phone}` : undefined], ["E-Mail", r.email, r.email ? `mailto:${r.email}` : undefined],
            ["Fahrzeug", v?.title, v ? `${origin}/fahrzeuge/${v.slug}` : undefined], ["Nachricht", r.message]];
        }

        const from = process.env["MAIL_FROM"] || "Bavaria Autoarena <onboarding@resend.dev>";
        const dealerTo = process.env["DEALER_NOTIFY_EMAIL"] || "info@bavaria-autoarena.de";
        let sent = 0;
        try {
          const d = renderMail({ heading: dealerSubject, intro: ["Über die Website ist eine neue Anfrage eingegangen."], rows, cta: { href: `${origin}${adminPath}`, label: "In der Verwaltung öffnen" }, origin });
          await sendResend(key, { from, to: dealerTo, subject: dealerSubject, ...d, ...(email ? { reply_to: email } : {}) });
          sent++;
        } catch (e) { console.log("dealer mail failed", id, e instanceof Error ? e.message : "error"); }
        if (email) {
          try {
            const c = renderMail({ heading: "Vielen Dank für Ihre Anfrage", intro: [salutation, "vielen Dank für Ihre Anfrage bei der Bavaria Autoarena. Wir haben folgende Angaben erhalten:", "Wir melden uns innerhalb von 24 Stunden an Werktagen bei Ihnen."], rows: [...summary, ...dealerContactRows()], origin });
            await sendResend(key, { from, to: email, subject: "Ihre Anfrage bei Bavaria Autoarena", ...c });
            sent++;
          } catch (e) { console.log("customer mail failed", id, e instanceof Error ? e.message : "error"); }
        }
        console.log("mail done", id, sent);
        return json({ sent: sent > 0 });
      },
    },
  },
});
