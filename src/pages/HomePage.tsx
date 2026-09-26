import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleCard, VehicleCardSkeleton } from "@/components/vehicles/VehicleCard";
import { mapsRouteUrl, openingRows, phoneHref, siteConfig, whatsappHref } from "@/config/site";
import { MapGraphic, PhotoPlaceholder, Testimonials } from "@/components/site/shared";
import { brandsQuery, highlightsQuery } from "@/lib/vehicles";

function useBrands() { return useQuery(brandsQuery()).data ?? []; }

const section = "mx-auto max-w-[1200px] border-t border-border px-6 py-16 md:px-12 md:py-24 lg:py-28";
const h2 = "font-display text-[1.75rem] font-semibold leading-[1.15] text-foreground md:text-4xl";
const textLink = "text-sm font-semibold text-silver underline decoration-silver/60 underline-offset-4 hover:text-gold";

function QuickSearch() {
  const navigate = useNavigate();
  const brands = useBrands();
  const [brand, setBrand] = useState("alle");
  const [price, setPrice] = useState("alle");
  const [fuel, setFuel] = useState("alle");
  function submit(event: FormEvent) {
    event.preventDefault();
    const search = new URLSearchParams();
    if (brand !== "alle") search.set("marke", brand);
    if (price !== "alle") search.set("preisBis", price);
    if (fuel !== "alle") search.set("kraftstoff", fuel);
    navigate({ to: "/fahrzeuge", search: Object.fromEntries(search.entries()) });
  }
  return <form onSubmit={submit} className="grid gap-4 border border-border bg-background/95 p-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
    <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Marke<Select value={brand} onValueChange={setBrand}><SelectTrigger className="mt-2 h-12 bg-background"><SelectValue placeholder="Alle Marken" /></SelectTrigger><SelectContent><SelectItem value="alle">Alle Marken</SelectItem>{brands.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label>
    <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preis bis<Select value={price} onValueChange={setPrice}><SelectTrigger className="mt-2 h-12 bg-background"><SelectValue placeholder="Alle Preise" /></SelectTrigger><SelectContent><SelectItem value="alle">Alle Preise</SelectItem>{[10000, 15000, 20000, 25000, 50000].map((item) => <SelectItem key={item} value={String(item)}>{item.toLocaleString("de-DE")} €</SelectItem>)}</SelectContent></Select></label>
    <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kraftstoff<Select value={fuel} onValueChange={setFuel}><SelectTrigger className="mt-2 h-12 bg-background"><SelectValue placeholder="Alle Kraftstoffe" /></SelectTrigger><SelectContent><SelectItem value="alle">Alle Kraftstoffe</SelectItem><SelectItem value="Benzin">Benzin</SelectItem><SelectItem value="Diesel">Diesel</SelectItem></SelectContent></Select></label>
    <Button type="submit" variant="gold">Suchen</Button>
  </form>;
}

function Highlights() {
  const { data, isPending, isError } = useQuery(highlightsQuery(6));
  if (isPending) return <>{Array.from({ length: 6 }, (_, i) => <VehicleCardSkeleton key={i} />)}</>;
  if (isError || !data.length) return <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">Die Fahrzeuge konnten gerade nicht geladen werden. <a href={siteConfig.mobileDeUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold hover:text-gold-light">Unseren Bestand auf mobile.de ansehen</a></div>;
  return <>{data.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</>;
}

export default function HomePage() {
  return <>
    <section className="relative min-h-[85vh] overflow-hidden">
      <img src="/hero.jpg" alt="Gebrauchtwagen auf einer Straße in bergiger Landschaft" width="1920" height="1080" fetchPriority="high" className="absolute inset-0 size-full object-cover object-center" />
      <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/70 to-transparent" />
      <div className="relative mx-auto flex min-h-[85vh] max-w-[1200px] flex-col justify-center px-6 pb-44 pt-16 md:px-12"><div className="max-w-[560px]"><h1 className="font-display text-4xl font-bold uppercase leading-[1.05] text-foreground md:text-[56px]">Gebrauchtwagen aus Perkam.</h1><p className="mt-5 text-sm text-silver">Autohaus in Perkam bei Straubing · Gewerbestraße 7</p><p className="mt-5 max-w-[560px] text-lg leading-[1.6] text-foreground/80">Familienautos, SUV und Vans zwischen 6.000 und 25.000 Euro. Jedes Auto haben wir selbst eingekauft, angeschaut und Probe gefahren.</p><div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"><Button asChild variant="gold"><Link to="/fahrzeuge">Fahrzeuge ansehen</Link></Button><Link to="/auto-verkaufen" className={textLink}>Auto in Zahlung geben →</Link></div></div></div>
      <div className="absolute inset-x-0 bottom-5"><div className="mx-auto max-w-[1200px] px-6 md:px-12"><QuickSearch /></div></div>
    </section>

    <Reveal className={section}><div className="flex flex-wrap items-end justify-between gap-4"><h2 className={h2}>Zuletzt reingekommen</h2><Link to="/fahrzeuge" className={textLink}>Alle 20 Fahrzeuge →</Link></div><div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"><Highlights /></div></Reveal>

    <Reveal className={section}><div className="grid gap-10 md:grid-cols-12 md:items-center"><div className="md:col-span-7"><PhotoPlaceholder label="Fahrzeugbewertung auf dem Hof" /></div><div className="md:col-span-5"><h2 className={h2}>Was ist Ihr Auto wert?</h2><p className="mt-7 text-[17px] leading-[1.6] text-foreground/80">Marke, Modell, Kilometer eintragen – wir melden uns am nächsten Werktag mit einem Preis. Kostet nichts, verpflichtet zu nichts. Oder Sie schicken uns einfach Fotos per WhatsApp.</p><ul className="mt-6 space-y-3 text-base leading-[1.6] text-foreground/80"><li>– Auszahlung bei Übergabe, per Überweisung oder direkt angerechnet auf Ihr nächstes Auto</li><li>– Abmeldung erledigen wir</li><li>– Auch mit laufender Finanzierung möglich</li></ul><div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"><Button asChild variant="gold"><Link to="/auto-verkaufen">Preis anfragen</Link></Button><a href={whatsappHref("Hallo Bavaria Autoarena, ich möchte Fotos von meinem Auto senden.")} target="_blank" rel="noopener noreferrer" className={textLink}>Fotos per WhatsApp →</a></div></div></div></Reveal>

    <Reveal className={section}><div className="grid gap-10 md:grid-cols-12 md:items-center"><div className="md:col-span-5"><h2 className={h2}>Wer hier verkauft, hat das Auto auch eingekauft.</h2><p className="mt-7 text-[17px] leading-[1.6] text-foreground/80">Die Bavaria Autoarena ist ein inhabergeführtes Autohaus in Perkam bei Straubing. Angefangen haben wir in Aiterhofen, heute stehen unsere Autos in der Gewerbestraße 7. Wir kaufen die Autos selbst ein, fahren sie Probe und schreiben in die Anzeige, was wir gefunden haben – auch die Kratzer. Wenn Sie anrufen, geht [[PLATZHALTER: Vorname Nachname]] ran, kein Callcenter.</p><h3 className="mt-7 font-semibold text-foreground">Das machen wir außerdem</h3><p className="mt-3 leading-[1.6] text-foreground/80">Finanzierung über Santander und DKB · Zulassung in Straubing · Lieferung nach Hause · Export mit Ausfuhrkennzeichen</p><div className="mt-6 flex flex-wrap gap-6"><Link to="/leistungen" className={textLink}>Alle Leistungen →</Link><Link to="/ueber-uns" className={textLink}>Mehr über uns →</Link></div></div><div className="md:col-span-7"><PhotoPlaceholder label="Autohaus Perkam, Außenansicht abends" /></div></div></Reveal>

    <Reveal className={section}><div className="grid gap-10 md:grid-cols-2"><div><h2 className={h2}>Das sagen Kunden auf mobile.de</h2><p className="mt-7 text-[17px] leading-[1.6] text-foreground/80">4,7 von 5 Sternen bei 85 Bewertungen (Stand 09/2026) · <a href={siteConfig.mobileDeUrl} target="_blank" rel="noopener noreferrer" className={textLink}>Alle Bewertungen ansehen →</a></p></div><div><Testimonials /><p className="mt-6 text-xs leading-5 text-muted-foreground">Gekürzt wiedergegeben. Auf mobile.de bewerten nur Kunden, die dort Kontakt aufgenommen haben; mobile.de prüft die Bewertungen.</p></div></div></Reveal>

    <Reveal className={section}><h2 className={h2}>Gewerbestraße 7, Perkam</h2><div className="mt-10 grid gap-10 md:grid-cols-2"><div><p className="max-w-[640px] text-[17px] leading-[1.6] text-foreground/80">Von Straubing 15 Minuten über die B20, von Regensburg und Deggendorf etwa 35, von Landshut 45. Wer außerhalb der Öffnungszeiten kommen will, ruft kurz an – das geht meistens.</p><div className="mt-7 grid gap-8 sm:grid-cols-2"><div className="text-sm leading-7 text-foreground/80"><a href={phoneHref} className="block hover:text-gold">{siteConfig.phone}</a><a href={`mailto:${siteConfig.email}`} className="block break-all hover:text-gold">{siteConfig.email}</a></div><table className="w-full text-sm text-muted-foreground"><tbody><tr><th className="py-1 text-left font-medium">Mo–Fr</th><td className="py-1 text-right">09:00–18:00</td></tr><tr><th className="py-1 text-left font-medium">Sa</th><td className="py-1 text-right">09:00–13:00</td></tr><tr><th className="py-1 text-left font-medium">So</th><td className="py-1 text-right">Geschlossen</td></tr></tbody></table></div><div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"><Button asChild variant="gold"><a href={mapsRouteUrl} target="_blank" rel="noopener noreferrer">Route öffnen</a></Button><a href={phoneHref} className={textLink}>Anrufen</a></div></div><MapGraphic /></div></Reveal>
  </>;
}