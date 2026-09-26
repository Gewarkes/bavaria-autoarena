import { useEffect, useState, type FormEvent } from "react";
import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Chip, MapGraphic, PrivacyHint } from "@/components/site/shared";
import { LeadBasicsFields, LeadSubmit, LeadSuccess, useLeadForm } from "@/components/forms/LeadBasics";
import { currentOpeningStatus, isOpenNow, mapsRouteUrl, openingRows, phoneHref, siteConfig, whatsappHref } from "@/config/site";

const topics = ["Termin vereinbaren", "Probefahrt", "Frage zu einem Fahrzeug", "Zulassung", "Lieferung", "Export", "Sonstiges"] as const;

export function ContactForm() {
  const form = useLeadForm();
  const [topic, setTopic] = useState<(typeof topics)[number]>("Termin vereinbaren");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<"" | "Vormittag" | "Nachmittag">("");
  const [message, setMessage] = useState("");
  if (form.state === "done") return <LeadSuccess>Vielen Dank! Wir melden uns schnellstmöglich bei Ihnen.</LeadSuccess>;
  function submit(e: FormEvent) {
    e.preventDefault();
    const lines = [`Anliegen: ${topic}`];
    if (date || slot) lines.push(`Wunschtermin: ${date ? new Date(date).toLocaleDateString("de-DE") : "offen"}${slot ? `, ${slot}` : ""}`);
    if (message.trim()) lines.push("", message.trim());
    void form.send({ kind: topic === "Probefahrt" ? "probefahrt" : "kontakt", vehicleId: null, message: lines.join("\n").slice(0, 2000) });
  }
  const lbl = "block text-xs font-semibold uppercase tracking-wide text-muted-foreground";
  return (
    <form onSubmit={submit} noValidate className="relative space-y-4 rounded-lg border border-gold/60 bg-card p-6 shadow-gold">
      <h2 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">Schreiben Sie uns</h2>
      <div className={lbl}>Anliegen<div role="radiogroup" aria-label="Anliegen" className="mt-2 flex flex-wrap gap-2 normal-case tracking-normal">{topics.map((t) => <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>{t}</Chip>)}</div></div>
      <LeadBasicsFields form={form} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={lbl}>Wunschtermin (optional)<Input type="date" className="mt-2 h-12" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} /></label>
        <div className={lbl}>Tageszeit<div role="radiogroup" aria-label="Tageszeit" className="mt-2 flex gap-2 normal-case tracking-normal">{(["Vormittag", "Nachmittag"] as const).map((s) => <Chip key={s} active={slot === s} onClick={() => setSlot(slot === s ? "" : s)}>{s}</Chip>)}</div></div>
      </div>
      <label className={lbl}>Nachricht<Textarea className="mt-2" rows={4} maxLength={1500} value={message} onChange={(e) => setMessage(e.target.value)} /></label>
      <PrivacyHint />
      <LeadSubmit form={form} label="Nachricht senden" />
    </form>
  );
}

export default function ContactPage() {
  const [today, setToday] = useState("");
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    setToday(new Date().toLocaleDateString("de-DE", { timeZone: "Europe/Berlin", weekday: "long" }));
    setStatus({ open: isOpenNow(), text: currentOpeningStatus() });
  }, []);
  return (
    <section className="bg-rauten">
      <div className="mx-auto max-w-7xl px-5 py-14 md:py-20 lg:px-6">
        <p className="font-display text-xs font-bold uppercase tracking-wide text-gold">Kontakt & Anfahrt</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-wide text-foreground sm:text-5xl">Besuchen Sie uns in Perkam.</h1>
        <div className="mt-6 h-px w-20 bg-gold-gradient" />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="flex gap-3 text-foreground"><MapPin className="size-5 shrink-0 text-gold" />{siteConfig.name}<br />{siteConfig.street}, {siteConfig.zip} {siteConfig.city}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild variant="gold"><a href={phoneHref}><Phone />{siteConfig.phone}</a></Button>
                <Button asChild variant="silver"><a href={whatsappHref()} target="_blank" rel="noopener noreferrer"><MessageCircle />WhatsApp</a></Button>
              </div>
              <a href={`mailto:${siteConfig.email}`} className="mt-4 flex items-center gap-3 text-sm text-silver hover:text-gold"><Mail className="size-4 text-gold" />{siteConfig.email}</a>
              <div className="mt-6 flex items-center justify-between"><h2 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">Öffnungszeiten</h2>{status && <span className={`text-sm font-medium ${status.open ? "text-success" : "text-muted-foreground"}`}>{status.open ? "Jetzt geöffnet" : "Jetzt geschlossen"}</span>}</div>
              <table className="mt-3 w-full text-sm"><tbody>{openingRows.map(([label, key]) => <tr key={key} className={today === label ? "font-semibold text-gold" : "text-muted-foreground"}><th className="py-1.5 text-left font-inherit">{label}{today === label && " (heute)"}</th><td className="py-1.5 text-right">{siteConfig.openingHours[key]}</td></tr>)}</tbody></table>
              <Button asChild variant="silver" className="mt-6"><a href={mapsRouteUrl} target="_blank" rel="noopener noreferrer"><ExternalLink />Route in Google Maps öffnen</a></Button>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 text-sm leading-7 text-muted-foreground">
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">Anfahrt</h2>
              <ul className="mt-3 space-y-1">
                <li>Von Straubing: ca. 15 Min über die B20 [[PLATZHALTER: Anfahrt prüfen]]</li>
                <li>Von Regensburg: ca. 35 Min</li>
                <li>Von Landshut: ca. 45 Min</li>
                <li>Von Deggendorf: ca. 35 Min</li>
              </ul>
            </div>
          </div>
          <div className="space-y-8"><ContactForm /><MapGraphic /></div>
        </div>
      </div>
    </section>
  );
}
