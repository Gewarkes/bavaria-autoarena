import { getRouteApi } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, EyeOff, FileCheck2, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TradeInWizard } from "@/components/tradein/TradeInWizard";
import { Reveal } from "@/components/Reveal";
import { tradeInFaq } from "@/lib/tradeInFaq";

const route = getRouteApi("/auto-verkaufen/");

const steps = [
  { title: "Daten eingeben", text: "Fahrzeug und Kontakt in rund 2 Minuten." },
  { title: "Angebot erhalten", text: "Innerhalb von 24 Stunden an Werktagen." },
  { title: "Auto abgeben oder anrechnen lassen", text: "Auszahlung sofort bei Übergabe." },
];
const benefits = [
  { icon: Repeat, title: "Direkte Anrechnung auf Ihr Wunschfahrzeug" },
  { icon: EyeOff, title: "Keine Inserate, keine fremden Besichtigungen" },
  { icon: BadgeCheck, title: "Faire Bewertung durch unser Team vor Ort" },
  { icon: FileCheck2, title: "Abmeldung übernehmen wir" },
];

function scrollToFunnel() { document.getElementById("bewertung")?.scrollIntoView({ behavior: "smooth", block: "start" }); }

export default function SellCarPage() {
  const search = route.useSearch();
  return (
    <>
      <section className="bg-rauten relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:py-16 lg:grid-cols-[1fr_minmax(0,560px)] lg:items-start lg:px-6">
          <div className="lg:pt-8">
            <p className="font-display text-xs font-bold uppercase tracking-wide text-gold">Auto verkaufen oder in Zahlung geben</p>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-wide text-foreground sm:text-5xl lg:text-6xl">Was ist Ihr Auto wert?</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-silver">In 2 Minuten anfragen – kostenlos, unverbindlich, Angebot innerhalb von 24 Stunden an Werktagen.</p>
          </div>
          <TradeInWizard initialBrand={search.marke} initialModel={search.modell} initialDesiredVehicleId={search.wunschfahrzeug} />
        </div>
      </section>

      <Reveal className="mx-auto max-w-7xl px-5 py-16 lg:px-6">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">So einfach geht's</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-lg border border-border bg-card p-6">
              <span className="text-gold-gradient font-display text-5xl font-extrabold">{i + 1}</span>
              <h3 className="mt-3 font-display text-base font-bold uppercase tracking-wide text-foreground">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title }) => (
            <li key={title} className="flex items-start gap-3 rounded-lg border border-border p-5 transition-colors hover:border-gold/50"><Icon className="size-6 shrink-0 text-gold" /><span className="text-sm font-medium text-foreground">{title}</span></li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mx-auto max-w-3xl px-5 pb-16 lg:px-6">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">Häufige Fragen</h2>
        <Accordion type="single" collapsible className="mt-6">
          {tradeInFaq.map((f, i) => (
            <AccordionItem key={f.q} value={`f${i}`}><AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{f.a}</AccordionContent></AccordionItem>
          ))}
        </Accordion>
      </Reveal>

      <section className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-5 py-14 md:flex-row md:items-center md:justify-between lg:px-6">
          <div><h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">Jetzt kostenlos bewerten lassen</h2><p className="mt-2 text-muted-foreground">Unverbindlich – Sie entscheiden erst nach unserem Angebot.</p></div>
          <Button variant="gold" onClick={scrollToFunnel}>Zur Bewertung<ArrowRight /></Button>
        </div>
      </section>
    </>
  );
}
