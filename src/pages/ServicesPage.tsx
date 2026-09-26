import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero, PhotoPlaceholder } from "@/components/site/shared";
import { ContactForm } from "@/pages/ContactPage";

const services = [
  ["Autoankauf und Inzahlungnahme", "Sie schicken uns die Eckdaten und, wenn möglich, Fotos. Am nächsten Werktag nennen wir Ihnen einen Preis. Bei einer Inzahlungnahme ziehen wir den Betrag direkt vom Kaufpreis ab.", "/auto-verkaufen", "Preis anfragen"],
  ["Finanzierung", "Über Santander Consumer Bank und DKB vermitteln wir Laufzeiten von 12 bis 84 Monaten. Anzahlung und Schlussrate sind je nach Bankangebot möglich. Bonität vorausgesetzt.", "/finanzierung", "Finanzierung anfragen"],
  ["Zulassung", "Auf Wunsch übernehmen wir die Zulassung im Landkreis Straubing-Bogen. [[PLATZHALTER: Preis und enthaltene Leistungen]].", "/kontakt", "Zulassung anfragen"],
  ["Lieferung", "Wenn Sie nicht selbst abholen können, organisieren wir die Lieferung. [[PLATZHALTER: Liefergebiet, Preis je Kilometer und Übergabeablauf]].", "/kontakt", "Lieferung anfragen"],
  ["Export", "Wir unterstützen beim Fahrzeugexport und bei Ausfuhrkennzeichen. [[PLATZHALTER: verfügbare Exportleistungen und Dokumente]].", "/kontakt", "Export anfragen"],
  ["Gewährleistung", "Beim Verbraucherkauf gilt eine gesetzliche Gewährleistung von zwölf Monaten. [[PLATZHALTER: Angaben zu optionaler Gebrauchtwagengarantie und Anbieter]].", "/kontakt", "Frage stellen"],
] as const;

export default function ServicesPage() {
  return <>
    <PageHero title="Was wir rund ums Auto erledigen">Vom Ankauf bis zur Zulassung: Hier steht, was wir übernehmen und wo noch eine individuelle Absprache nötig ist.</PageHero>
    <div className="mx-auto max-w-[1200px] px-6 md:px-12">
      {services.map(([title, text, to, cta], index) => <section key={title} className="grid gap-10 border-b border-border py-16 md:grid-cols-2 md:py-24"><div className={index % 2 ? "md:order-2" : ""}><p className="text-sm text-muted-foreground">0{index + 1}</p><h2 className="section-h2 mt-4">{title}</h2><p className="mt-6 max-w-[640px] leading-[1.6] text-foreground/80">{text}</p><Button asChild variant="silver" className="mt-7"><Link to={to}>{cta} →</Link></Button></div><PhotoPlaceholder label={`[[PLATZHALTER: Foto ${title}]]`} /></section>)}
    </div>
    <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-12 md:py-24"><div className="max-w-2xl"><h2 className="section-h2">Leistung anfragen</h2><p className="mt-6 text-foreground/80">Schreiben Sie das Thema und die wichtigsten Angaben ins Nachrichtenfeld. Wir melden uns am nächsten Werktag.</p><div className="mt-8"><ContactForm /></div></div></div>
  </>;
}