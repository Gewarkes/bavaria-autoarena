import { getRouteApi } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TradeInWizard } from "@/components/tradein/TradeInWizard";
import { Reveal } from "@/components/Reveal";
import { tradeInFaq } from "@/lib/tradeInFaq";

const route = getRouteApi("/auto-verkaufen/");

const steps = [
  { title: "Daten eintragen", text: "Marke, Modell, Erstzulassung und Kilometer genügen für den Anfang." },
  { title: "Preis bekommen", text: "Wir prüfen Ihre Angaben und melden uns am nächsten Werktag." },
  { title: "Auto übergeben", text: "Sie verkaufen direkt oder lassen den Betrag auf Ihr nächstes Auto anrechnen." },
];
const benefits = [
  "Sie brauchen keine Anzeige zu schreiben und keine fremden Besichtigungen zu organisieren.",
  "Bei Übergabe zahlen wir per Überweisung oder rechnen den Betrag auf Ihr nächstes Auto an.",
  "Wir übernehmen die Abmeldung und schicken Ihnen die Bestätigung.",
  "Auch Autos mit laufender Finanzierung oder Unfallschaden können Sie anfragen.",
];

export default function SellCarPage() {
  const search = route.useSearch();
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 md:px-12 md:py-24 lg:grid-cols-[1fr_minmax(0,560px)] lg:items-start">
          <div className="lg:pt-8">
            <h1 className="font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl">Auto verkaufen oder in Zahlung geben</h1>
            <p className="mt-6 max-w-xl text-[17px] leading-[1.6] text-foreground/80">Sie tragen die wichtigsten Daten ein. Wir sehen uns den Markt und Ihre Angaben an und melden uns am nächsten Werktag mit einem Preis. Danach entscheiden Sie.</p>
          </div>
          <TradeInWizard initialBrand={search.marke} initialModel={search.modell} initialDesiredVehicleId={search.wunschfahrzeug} />
        </div>
      </section>

      <Reveal className="mx-auto max-w-[1200px] border-b border-border px-6 py-16 md:px-12 md:py-24">
        <h2 className="section-h2">So läuft der Verkauf</h2>
        <ol className="mt-10 divide-y divide-border md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
          {steps.map((s, i) => (
            <li key={s.title} className="py-7 md:px-8 md:py-0 first:pl-0">
              <span className="text-sm text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 leading-[1.6] text-foreground/75">{s.text}</p>
            </li>
          ))}
        </ol>
        <h2 className="section-h2 mt-16">Was wir übernehmen</h2><ul className="mt-8 max-w-3xl space-y-3">
          {benefits.map((title) => <li key={title} className="border-b border-border pb-3 leading-[1.6] text-foreground/80">{title}</li>)}
        </ul>
      </Reveal>

      <Reveal className="mx-auto max-w-[1200px] px-6 py-16 md:px-12 md:py-24"><div className="max-w-3xl">
        <h2 className="section-h2">Häufige Fragen</h2>
        <Accordion type="single" collapsible className="mt-6">
          {tradeInFaq.map((f, i) => (
            <AccordionItem key={f.q} value={`f${i}`}><AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{f.a}</AccordionContent></AccordionItem>
          ))}
        </Accordion>
      </div></Reveal>
    </>
  );
}
