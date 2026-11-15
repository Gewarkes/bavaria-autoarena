import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero, PhotoPlaceholder } from "@/components/site/shared";
import { TerminFlow } from "@/components/termin/TerminDialog";

const services = [
  ["Autoankauf und Inzahlungnahme", "Sie schicken uns die Eckdaten und, wenn möglich, Fotos. Am nächsten Werktag nennen wir Ihnen einen Preis. Bei einer Inzahlungnahme ziehen wir den Betrag direkt vom Kaufpreis ab.", "/auto-verkaufen", "Bewertung anfragen"],
  ["Finanzierung", "Über Santander Consumer Bank und DKB vermitteln wir Laufzeiten von 12 bis 84 Monaten. Anzahlung und Schlussrate sind je nach Bankangebot möglich. Bonität vorausgesetzt.", "/finanzierung", "Finanzierung anfragen"],
  ["Zulassung", "Ob und in welchem Umfang wir die Zulassung übernehmen können, klären wir individuell mit Ihnen.", "/kontakt", "Zulassung anfragen"],
  ["Lieferung", "Eine mögliche Fahrzeuglieferung und die Konditionen stimmen wir individuell mit Ihnen ab.", "/kontakt", "Lieferung anfragen"],
  ["Export", "Fragen zu Export und Ausfuhrkennzeichen klären wir passend zu Ihrem Fahrzeug und Zielland.", "/kontakt", "Export anfragen"],
  ["Gewährleistung", "Bei Fragen zu Gewährleistung und möglichen Zusatzleistungen beraten wir Sie persönlich.", "/kontakt", "Frage stellen"],
] as const;

export default function ServicesPage() {
  return <>
    <PageHero title="Was wir rund ums Auto erledigen">Vom Ankauf bis zur Zulassung: Hier steht, was wir übernehmen und wo noch eine individuelle Absprache nötig ist.</PageHero>
    <div className="page-container ">
      {services.map(([title, text, to, cta], index) => <section key={title} className="grid gap-10 border-b border-border py-16 md:grid-cols-2 md:py-24"><div className={index % 2 ? "md:order-2" : ""}><p className="text-sm text-muted-foreground">0{index + 1}</p><h2 className="section-h2 mt-4">{title}</h2><p className="mt-6 max-w-[640px] leading-[1.6] text-muted-foreground">{text}</p><Button asChild variant="outline" className="mt-7"><Link to={to}>{cta}</Link></Button></div><PhotoPlaceholder label={title} /></section>)}
    </div>
    <div className="page-container py-16  md:py-24"><div className="max-w-2xl"><h2 className="section-h2">Leistung anfragen</h2><p className="mt-6 text-muted-foreground">Nennen Sie uns einen Wunschtermin und das Thema als Anmerkung. Wir rufen Sie kurz zurück.</p><div className="mt-8 rounded-sm bg-card p-6 ring-1 ring-foreground/5 md:p-8"><TerminFlow initialTopic="Beratung / Finanzierung" /></div></div></div>
  </>;
}