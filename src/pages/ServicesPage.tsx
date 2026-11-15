import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/shared";
import serviceImage from "@/assets/service-schluesseluebergabe.webp";
import { TerminFlow } from "@/components/termin/TerminDialog";

const services = [
  ["Autoankauf und Inzahlungnahme", "Sie schicken uns die Eckdaten und, wenn möglich, Fotos. Am nächsten Werktag nennen wir Ihnen einen Preis. Bei einer Inzahlungnahme ziehen wir den Betrag direkt vom Kaufpreis ab.", "/auto-verkaufen", "Bewertung anfragen"],
  ["Finanzierung", "Finanzierung über unsere Partnerbanken Santander und DKB – wir bereiten die Anfrage mit Ihnen vor.", "/finanzierung", "Finanzierung anfragen"],
  ["Zulassung", "Ob und in welchem Umfang wir die Zulassung übernehmen können, klären wir individuell mit Ihnen.", "/kontakt", "Zulassung anfragen"],
  ["Lieferung", "Eine mögliche Fahrzeuglieferung und die Konditionen stimmen wir individuell mit Ihnen ab.", "/kontakt", "Lieferung anfragen"],
  ["Export", "Fragen zu Export und Ausfuhrkennzeichen klären wir passend zu Ihrem Fahrzeug und Zielland.", "/kontakt", "Export anfragen"],
] as const;

export default function ServicesPage() {
  return <>
    <PageHero title="Was wir rund ums Auto erledigen">Inzahlungnahme, Finanzierung, Zulassung und Lieferung – wir stimmen die Abwicklung mit Ihnen ab.</PageHero>
    <div className="section-space page-container grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5"><div className="overflow-hidden rounded-sm bg-image-placeholder lg:sticky lg:top-28"><img src={serviceImage} alt="Übergabe eines Autoschlüssels vor einem dunklen Fahrzeug" width={1200} height={1504} loading="lazy" className="aspect-[4/3] size-full object-cover object-center lg:aspect-[4/5]" /></div></div>
      <ol className="border-t border-border lg:col-span-7">{services.map(([title, text, to, cta], index) => <li key={title} className="grid gap-4 border-b border-border py-10 sm:grid-cols-[64px_minmax(0,1fr)] lg:py-12"><span className="font-display text-sm tabular-nums text-primary">{String(index + 1).padStart(2, "0")}</span><div><h2 className="section-h3 text-foreground">{title}</h2><p className="mt-4 max-w-[60ch] leading-[1.65] text-muted-foreground">{text}</p><Link to={to} className="text-link mt-3 text-primary">{cta}</Link></div></li>)}</ol>
    </div>
    <div className="section-space border-t border-border bg-ink-900"><div className="page-container"><div className="max-w-2xl"><p className="eyebrow text-primary">Kontakt</p><h2 className="section-h2 mt-4">Leistung anfragen</h2><span aria-hidden="true" className="brand-line mt-6 block h-px w-16" /><p className="mt-6 text-muted-foreground">Nennen Sie uns einen Wunschtermin und das Thema als Anmerkung. Wir rufen Sie kurz zurück.</p><div className="mt-8 rounded-sm bg-card p-6 ring-1 ring-foreground/5 md:p-8"><TerminFlow initialTopic="Beratung / Finanzierung" /></div></div></div></div>
  </>;
}