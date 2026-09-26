import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarRange, Coins, Repeat, Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHero, H2, PrivacyHint } from "@/components/site/shared";
import { LeadBasicsFields, LeadSubmit, LeadSuccess, useLeadForm } from "@/components/forms/LeadBasics";
import { FinancingExample } from "@/components/FinancingExample";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/config/site";
import { vehiclesQuery } from "@/lib/vehicles";
import { formatPrice } from "@/lib/format";

const steps = ["Fahrzeug wählen", "Wunschrate & Laufzeit besprechen", "Bonitätsprüfung durch die Bank", "Vertrag unterschreiben & losfahren"];
const benefits = [
  { icon: Coins, title: "Anzahlung flexibel", text: "Mit oder ohne Anzahlung – ganz nach Ihrem Budget." },
  { icon: CalendarRange, title: "Laufzeit 12–84 Monate", text: "Die Laufzeit passen wir Ihrer Wunschrate an." },
  { icon: Repeat, title: "Inzahlungnahme als Anzahlung", text: "Ihr bisheriges Fahrzeug senkt den Finanzierungsbetrag." },
  { icon: Flag, title: "Schlussrate möglich", text: "Niedrigere Monatsraten durch eine Schlussrate." },
];
const rates = ["bis 150 €", "150–250 €", "250–400 €", "über 400 €"];

function FinancingForm() {
  const form = useLeadForm();
  const vehicles = useQuery(vehiclesQuery({ sort: "preis-auf" }));
  const [vehicleId, setVehicleId] = useState("keins");
  const [rate, setRate] = useState("");
  const [down, setDown] = useState("");
  if (form.state === "done") return <LeadSuccess>Vielen Dank! Wir melden uns zeitnah mit einem passenden Finanzierungsvorschlag.</LeadSuccess>;
  function submit(e: FormEvent) {
    e.preventDefault();
    const v = vehicles.data?.find((x) => x.id === vehicleId);
    const lines = [v ? `Wunschfahrzeug: ${v.title} (${formatPrice(v.price_eur)})` : "Wunschfahrzeug: noch offen", `Wunschrate: ${rate || "keine Angabe"}`, `Anzahlung: ${down ? `${down} €` : "keine Angabe"}`];
    void form.send({ kind: "finanzierung", vehicleId: v ? v.id : null, message: lines.join("\n") });
  }
  const lbl = "block text-xs font-semibold uppercase tracking-wide text-muted-foreground";
  return (
    <form onSubmit={submit} noValidate className="relative space-y-4 rounded-lg border border-gold/60 bg-card p-6 shadow-gold">
      <h2 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">Finanzierung anfragen</h2>
      <div className={lbl}>Wunschfahrzeug (optional)
        <Select value={vehicleId} onValueChange={setVehicleId}><SelectTrigger className="mt-2 h-12" aria-label="Wunschfahrzeug"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="keins">Noch nicht entschieden</SelectItem>{(vehicles.data ?? []).map((v) => <SelectItem key={v.id} value={v.id}>{v.title} – {formatPrice(v.price_eur)}</SelectItem>)}</SelectContent></Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={lbl}>Wunschrate
          <Select value={rate} onValueChange={setRate}><SelectTrigger className="mt-2 h-12" aria-label="Wunschrate"><SelectValue placeholder="Bitte wählen" /></SelectTrigger><SelectContent>{rates.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
        </div>
        <label className={lbl}>Anzahlung in € (optional)<Input className="mt-2 h-12" inputMode="numeric" value={down} onChange={(e) => setDown(e.target.value.replace(/\D/g, "").slice(0, 6))} /></label>
      </div>
      <LeadBasicsFields form={form} />
      <PrivacyHint />
      <LeadSubmit form={form} label="Finanzierung anfragen" />
    </form>
  );
}

export default function FinancingPage() {
  return (
    <>
      <PageHero eyebrow="Finanzierung & Leasing" title="Ihr Wunschauto – zu Raten, die zu Ihnen passen.">
        Wir arbeiten mit {siteConfig.financingPartner} zusammen und finden gemeinsam die passende Lösung – auch mit Inzahlungnahme Ihres bisherigen Fahrzeugs.
      </PageHero>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_minmax(0,520px)] lg:px-6">
        <div className="space-y-14">
          <Reveal>
            <H2 eyebrow="In 4 Schritten">So läuft die Finanzierung</H2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2">{steps.map((s, i) => <li key={s} className="rounded-lg border border-border bg-card p-5"><span className="text-gold-gradient font-display text-4xl font-extrabold">{i + 1}</span><p className="mt-2 font-semibold text-foreground">{s}</p></li>)}</ol>
          </Reveal>
          <Reveal>
            <H2 eyebrow="Ihre Vorteile">Flexibel finanzieren</H2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">{benefits.map(({ icon: Icon, title, text }) => <li key={title} className="rounded-lg border border-border p-5 transition-colors hover:border-gold/50"><Icon className="size-6 text-gold" /><p className="mt-3 font-semibold text-foreground">{title}</p><p className="mt-1 text-sm text-muted-foreground">{text}</p></li>)}</ul>
          </Reveal>
          {siteConfig.features.showMonthlyRate && <FinancingExample />}
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start"><FinancingForm /></div>
      </div>
      <p className="mx-auto max-w-7xl px-5 pb-16 text-xs leading-5 text-muted-foreground lg:px-6">Finanzierung vorbehaltlich Bonitätsprüfung durch den Finanzierungspartner. Wir vermitteln Finanzierungen als ungebundener Vermittler.</p>
    </>
  );
}
