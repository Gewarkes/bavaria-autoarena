import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHero, PrivacyHint } from "@/components/site/shared";
import { LeadBasicsFields, LeadSubmit, LeadSuccess, useLeadForm } from "@/components/forms/LeadBasics";
import { FinancingExample } from "@/components/FinancingExample";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/config/site";
import { vehiclesQuery } from "@/lib/vehicles";
import { formatPrice } from "@/lib/format";

const steps = ["Fahrzeug wählen", "Wunschrate & Laufzeit besprechen", "Bonitätsprüfung durch die Bank", "Vertrag unterschreiben & losfahren"];
const benefits = [
  ["Anzahlung", "Mit, ohne oder mit dem Erlös aus Ihrer Inzahlungnahme."],
  ["Laufzeit", "Zwischen 12 und 84 Monaten, abhängig vom Angebot der Bank."],
  ["Schlussrate", "Kann die Monatsrate senken. Wir zeigen Ihnen auch die Gesamtkosten."],
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
    const lines = [v ? `Nächstes Auto: ${v.title} (${formatPrice(v.price_eur)})` : "Nächstes Auto: noch offen", `Wunschrate: ${rate || "keine Angabe"}`, `Anzahlung: ${down ? `${down} €` : "keine Angabe"}`];
    void form.send({ kind: "finanzierung", vehicleId: v ? v.id : null, message: lines.join("\n") });
  }
  const lbl = "block text-xs font-semibold uppercase tracking-wide text-muted-foreground";
  return (
    <form onSubmit={submit} noValidate className="relative space-y-4 rounded border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Finanzierung anfragen</h2>
      <div className={lbl}>Ihr nächstes Auto (optional)
        <Select value={vehicleId} onValueChange={setVehicleId}><SelectTrigger className="mt-2 h-12" aria-label="Ihr nächstes Auto"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="keins">Noch nicht entschieden</SelectItem>{(vehicles.data ?? []).map((v) => <SelectItem key={v.id} value={v.id}>{v.title} – {formatPrice(v.price_eur)}</SelectItem>)}</SelectContent></Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={lbl}>Wunschrate
          <Select value={rate} onValueChange={setRate}><SelectTrigger className="mt-2 h-12" aria-label="Wunschrate"><SelectValue placeholder="Bitte wählen" /></SelectTrigger><SelectContent>{rates.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
        </div>
        <label className={lbl}>Anzahlung in € (optional)<Input className="mt-2 h-12" inputMode="numeric" enterKeyHint="next" value={down} onChange={(e) => setDown(e.target.value.replace(/\D/g, "").slice(0, 6))} /></label>
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
      <PageHero title="Finanzierung für Ihren Gebrauchtwagen">
        Wir vermitteln Kredite der Santander Consumer Bank und der DKB. Im Autohaus rechnen wir Laufzeit, Anzahlung und Gesamtkosten gemeinsam durch.
      </PageHero>
       <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:px-12 md:py-24 lg:grid-cols-[1fr_minmax(0,520px)]">
        <div className="space-y-14">
          <Reveal>
             <h2 className="section-h2">So läuft die Finanzierung</h2>
             <ol className="mt-8 divide-y divide-border">{steps.map((s, i) => <li key={s} className="flex gap-5 py-4"><span className="text-sm text-muted-foreground">0{i + 1}</span><p className="font-semibold text-foreground">{s}</p></li>)}</ol>
          </Reveal>
          <Reveal>
             <h2 className="section-h2">Was Sie festlegen können</h2>
             <dl className="mt-8 divide-y divide-border">{benefits.map(([title, text]) => <div key={title} className="py-5"><dt className="font-semibold text-foreground">{title}</dt><dd className="mt-2 leading-[1.6] text-foreground/75">{text}</dd></div>)}</dl>
          </Reveal>
          {siteConfig.features.showMonthlyRate && <FinancingExample />}
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start"><FinancingForm /></div>
      </div>
      <p className="mx-auto max-w-7xl px-5 pb-16 text-xs leading-5 text-muted-foreground lg:px-6">Finanzierung über Santander Consumer Bank oder DKB, Bonität vorausgesetzt. Wir vermitteln Finanzierungen als ungebundener Vermittler.</p>
    </>
  );
}
