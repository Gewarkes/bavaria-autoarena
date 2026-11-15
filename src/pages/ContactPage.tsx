import { useState, type FormEvent } from "react";
import { ExternalLink, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Chip, MapGraphic, PageHero, PrivacyHint } from "@/components/site/shared";
import { TerminFlow } from "@/components/termin/TerminDialog";
import { LeadBasicsFields, LeadSubmit, LeadSuccess, useLeadForm } from "@/components/forms/LeadBasics";
import { mapsRouteUrl, phoneHref, siteConfig, whatsappHref } from "@/config/site";

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
    <form onSubmit={submit} noValidate className="relative space-y-4 rounded border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Schreiben Sie uns</h2>
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
  return (
    <>
    <PageHero eyebrow="Kontakt" title="Termin und Anfahrt" />
    <section id="termin" className="scroll-mt-24 bg-background py-12 md:py-16"><div className="page-container"><div className="max-w-3xl rounded-sm bg-card p-6 ring-1 ring-foreground/5 md:p-10"><p className="eyebrow mb-5 text-primary">Termin vereinbaren</p><TerminFlow /></div></div></section>
    <section>
      <div className="page-container py-16 md:py-24">
        <div className="grid min-w-0 gap-8 lg:grid-cols-2">
          <div className="min-w-0 space-y-6">
            <div className="min-w-0 border-y border-border py-6 md:border md:p-6">
              <p className="flex gap-3 text-foreground"><MapPin className="size-5 shrink-0 text-primary" />{siteConfig.name}<br />{siteConfig.street}, {siteConfig.zip} {siteConfig.city}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild variant="brand"><a href={phoneHref}><Phone />{siteConfig.phone}</a></Button>
                <Button asChild variant="outline"><a href={siteConfig.mobileHref}><Phone />Mobil {siteConfig.mobile}</a></Button>
                <Button asChild variant="outline"><a href={whatsappHref()} target="_blank" rel="noopener noreferrer"><MessageCircle />WhatsApp</a></Button>
              </div>
              <div className="mt-6"><h2 className="font-display text-sm font-medium uppercase tracking-[.14em] text-foreground">Besichtigung und Probefahrt</h2><p className="mt-3 text-muted-foreground">{siteConfig.appointmentHours}</p></div>
              <Button asChild variant="outline" className="mt-6"><a href={mapsRouteUrl} target="_blank" rel="noopener noreferrer"><ExternalLink />Route in Google Maps öffnen</a></Button>
            </div>
          </div>
          <div className="min-w-0 space-y-8"><MapGraphic /></div>
        </div>
      </div>
    </section>
    </>
  );
}
