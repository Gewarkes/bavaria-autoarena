import { Link, useNavigate } from "@tanstack/react-router";
import { Award, BadgeCheck, CarFront, Check, Clock3, ExternalLink, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { siteConfig } from "@/config/site";
import { demoVehicles } from "@/data/demoVehicles";

const heroImage = demoVehicles[6]?.images[0];
const brands = [...new Set(demoVehicles.map((vehicle) => vehicle.brand))].sort();
const openingRows = [
  ["Montag", "monday"], ["Dienstag", "tuesday"], ["Mittwoch", "wednesday"], ["Donnerstag", "thursday"],
  ["Freitag", "friday"], ["Samstag", "saturday"], ["Sonntag", "sunday"],
] as const;

function SectionTitle({ eyebrow, children }: { eyebrow: string; children: string }) {
  return <div><p className="font-display text-xs font-bold uppercase tracking-wide text-gold">{eyebrow}</p><h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-wide text-foreground sm:text-4xl">{children}</h2></div>;
}

function QuickSearch() {
  const navigate = useNavigate();
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
  return <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-5 lg:px-6"><form onSubmit={submit} className="grid gap-4 rounded-lg border border-gold/50 bg-card p-5 shadow-gold md:grid-cols-[1fr_1fr_1fr_auto] md:items-end lg:p-7">
    <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Marke<Select value={brand} onValueChange={setBrand}><SelectTrigger className="mt-2 h-12 bg-background"><SelectValue placeholder="Alle Marken" /></SelectTrigger><SelectContent><SelectItem value="alle">Alle Marken</SelectItem>{brands.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label>
    <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preis bis<Select value={price} onValueChange={setPrice}><SelectTrigger className="mt-2 h-12 bg-background"><SelectValue placeholder="Alle Preise" /></SelectTrigger><SelectContent><SelectItem value="alle">Alle Preise</SelectItem>{[10000, 15000, 20000, 25000, 50000].map((item) => <SelectItem key={item} value={String(item)}>{item.toLocaleString("de-DE")} €</SelectItem>)}</SelectContent></Select></label>
    <label className="space-y-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kraftstoff<Select value={fuel} onValueChange={setFuel}><SelectTrigger className="mt-2 h-12 bg-background"><SelectValue placeholder="Alle Kraftstoffe" /></SelectTrigger><SelectContent><SelectItem value="alle">Alle Kraftstoffe</SelectItem><SelectItem value="Benzin">Benzin</SelectItem><SelectItem value="Diesel">Diesel</SelectItem></SelectContent></Select></label>
    <Button type="submit" variant="gold">Fahrzeuge finden</Button>
  </form><Link to="/fahrzeuge" className="mt-3 inline-block text-sm font-semibold text-gold hover:text-gold-light">Alle 25 Fahrzeuge ansehen →</Link></div>;
}

function TradeInTeaser() {
  const navigate = useNavigate();
  const [brand, setBrand] = useState("VW");
  const [model, setModel] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); navigate({ to: "/auto-verkaufen", search: { marke: brand, modell: model } }); }
  const waText = encodeURIComponent("Hallo Bavaria Autoarena, ich möchte mein Fahrzeug bewerten lassen und Fotos senden.");
  return <Reveal className="mx-auto max-w-7xl px-5 py-20 lg:px-6"><div className="grid gap-10 rounded-lg border border-gold/50 bg-card p-6 shadow-gold md:grid-cols-2 md:p-10 lg:p-14"><div><SectionTitle eyebrow="Auto in Zahlung geben">Was ist Ihr Auto wert? In 2 Minuten anfragen.</SectionTitle><ul className="mt-7 space-y-4 text-sm text-muted-foreground">{["100 % kostenlos und unverbindlich", "Angebot innerhalb von 24 Stunden an Werktagen", "Direkte Anrechnung auf Ihr Wunschfahrzeug"].map((item) => <li key={item} className="flex items-center gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full border border-gold/50 text-gold"><Check className="size-3.5" /></span>{item}</li>)}</ul></div><form onSubmit={submit} className="self-center rounded-lg border border-border bg-background p-5"><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Marke<Select value={brand} onValueChange={setBrand}><SelectTrigger className="mt-2 h-12"><SelectValue /></SelectTrigger><SelectContent>{brands.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label><label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Modell<Input value={model} onChange={(event) => setModel(event.target.value)} placeholder="z. B. Golf" className="mt-2 h-12" /></label><Button type="submit" variant="gold" className="mt-5 w-full">Jetzt bewerten lassen</Button><a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="mt-4 block text-center text-xs text-muted-foreground hover:text-gold">Oder Fotos direkt per WhatsApp senden</a></form></div></Reveal>;
}

export default function HomePage() {
  const today = new Date().toLocaleDateString("de-DE", { timeZone: "Europe/Berlin", weekday: "long" });
  return <>
    <section className="bg-rauten relative min-h-[720px] overflow-hidden md:min-h-[calc(85vh-6rem)]">
      {heroImage && <img src={heroImage} alt="Audi R8 aus dem Fahrzeugbestand der Bavaria Autoarena" width="1200" height="900" fetchPriority="high" className="hero-image-mask absolute inset-y-0 right-0 hidden h-full w-[62%] object-cover opacity-60 md:block" />}
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/85 to-background/10" />
      <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-5 pb-24 pt-16 md:min-h-[calc(85vh-6rem)] lg:px-6"><div className="max-w-3xl"><p className="font-display text-xs font-bold uppercase tracking-wide text-gold">Neu eröffnet · Perkam bei Straubing</p><h1 className="mt-5 font-display text-4xl font-extrabold uppercase tracking-wide text-foreground sm:text-6xl lg:text-7xl">Ihr neues Autohaus in Niederbayern.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-silver sm:text-xl">Geprüfte Gebrauchtwagen, ehrliche Beratung und faire Preise – jetzt im neu gebauten Autohaus in Perkam.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild variant="gold"><Link to="/fahrzeuge">Fahrzeuge ansehen</Link></Button><Button asChild variant="silver"><Link to="/auto-verkaufen">Auto in Zahlung geben</Link></Button></div><a href={siteConfig.mobileDeUrl} target="_blank" rel="noopener noreferrer" className="mt-8 flex max-w-xl items-start gap-3 text-sm leading-6 text-muted-foreground hover:text-foreground"><span className="shrink-0 tracking-wide text-gold">★★★★★</span><span>4,7 / 5 · 85 Bewertungen auf mobile.de (Stand 09/2026)</span></a></div></div>
    </section>
    <QuickSearch />

    <Reveal className="mx-auto max-w-7xl px-5 py-20 lg:px-6"><div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">{[
      [BadgeCheck, "Jedes Fahrzeug geprüft", "HU-Check, Probefahrt und Fahrzeughistorie vor dem Verkauf."],
      [ShieldCheck, "12 Monate Gewährleistung", "Gesetzliche Gewährleistung für Verbraucher inklusive."],
      [CarFront, "Faire Inzahlungnahme", "Ihr Altfahrzeug rechnen wir direkt auf Ihr Wunschauto an."],
      [MapPin, "Persönlich vor Ort", "Neu gebautes Autohaus in Perkam, 15 Minuten von Straubing."],
    ].map(([Icon, title, text]) => { const FeatureIcon = Icon as typeof BadgeCheck; return <div key={String(title)} className="bg-card p-6"><FeatureIcon className="size-7 text-gold" /><h3 className="mt-4 font-display text-sm font-bold uppercase tracking-wide text-foreground">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{String(text)}</p></div>; })}</div></Reveal>

    <Reveal className="mx-auto max-w-7xl px-5 pb-20 lg:px-6"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><SectionTitle eyebrow="Aus unserem Bestand">Aktuelle Highlights</SectionTitle><Link to="/fahrzeuge" className="hidden text-sm font-semibold text-gold hover:text-gold-light sm:block">Alle Fahrzeuge →</Link></div><div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{demoVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div></Reveal>

    <TradeInTeaser />

    <Reveal className="border-y border-border bg-darkest"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-6"><SectionTitle eyebrow="Darauf können Sie sich verlassen">Warum Bavaria Autoarena</SectionTitle><div className="mt-10 grid gap-8 sm:grid-cols-3">{[["85+", "Bewertungen auf mobile.de"], ["4,7 / 5", "Durchschnitt"], ["25+", "Fahrzeuge sofort verfügbar"]].map(([value, label]) => <div key={value} className="border-l border-gold/50 pl-5"><p className="text-gold-gradient font-display text-4xl font-extrabold tracking-wide">{value}</p><p className="mt-2 text-sm text-muted-foreground">{label}</p></div>)}</div><p className="mt-10 max-w-3xl leading-7 text-muted-foreground">Wir beraten Sie ehrlich und auf Augenhöhe. In unserem neu gebauten Autohaus in Perkam nehmen wir uns Zeit für Ihr Anliegen. Sie erhalten Fahrzeuge so, wie sie beschrieben sind.</p></div></Reveal>

    <Reveal className="mx-auto max-w-7xl px-5 py-20 lg:px-6"><SectionTitle eyebrow="Erfahrungen unserer Kunden">Kundenstimmen</SectionTitle><div className="mt-10 grid gap-5 md:grid-cols-3">{[
      ["Lukas M.", "Service ist sehr gut. Alles wie besprochen, gerne wieder."],
      ["Florian K.", "Sehr freundlicher, kompetenter und ehrlicher Verkäufer – auch nach dem Kauf noch geholfen."],
      ["Sebastian A.", "Alles wunderbar abgewickelt, schnelle Antworten auf allen Kanälen."],
    ].map(([name, quote]) => <figure key={name} className="rounded-lg border border-border bg-card p-6"><div className="flex gap-1 text-gold" aria-label="5 von 5 Sternen">{Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-4 fill-current" />)}</div><blockquote className="mt-5 leading-7 text-foreground">„{quote}“</blockquote><figcaption className="mt-5 text-sm font-semibold text-muted-foreground">{name}</figcaption></figure>)}</div><p className="mt-6 max-w-5xl text-xs leading-5 text-muted-foreground">Bewertungen stammen von mobile.de (Stand 09/2026). Dort können nur Nutzer bewerten, die über die Plattform Kontakt aufgenommen haben; mobile.de prüft die Bewertungen nach eigenen Richtlinien. Die Kundenstimmen sind gekürzt wiedergegeben. <a href={siteConfig.mobileDeUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold hover:text-gold-light">Alle Bewertungen auf mobile.de</a></p></Reveal>

    <Reveal className="border-y border-border bg-card"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2 lg:px-6"><div><SectionTitle eyebrow="Besuchen Sie uns">Ihr Weg zur Bavaria Autoarena</SectionTitle><div className="mt-8 grid gap-8 sm:grid-cols-2"><div className="space-y-4 text-sm text-muted-foreground"><p><span className="block font-semibold text-foreground">Adresse</span>{siteConfig.street}<br />{siteConfig.zip} {siteConfig.city}</p><p><span className="block font-semibold text-foreground">Telefon</span><a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-gold">{siteConfig.phone}</a></p><p><span className="block font-semibold text-foreground">E-Mail</span><a href={`mailto:${siteConfig.email}`} className="break-all hover:text-gold">{siteConfig.email}</a></p></div><table className="w-full text-sm"><tbody>{openingRows.map(([label, key]) => <tr key={key} className={today === label ? "text-gold" : "text-muted-foreground"}><th className="py-1 text-left font-medium">{label}</th><td className="py-1 text-right">{siteConfig.openingHours[key]}</td></tr>)}</tbody></table></div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild variant="silver"><a href="https://www.google.com/maps/dir/?api=1&destination=Gewerbestra%C3%9Fe+7,+94368+Perkam" target="_blank" rel="noopener noreferrer"><ExternalLink />Route in Google Maps öffnen</a></Button><Button asChild variant="ghost"><a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}><Phone />Anrufen</a></Button></div></div><div><div className="relative grid min-h-80 place-items-center overflow-hidden rounded-lg border border-border bg-darkest"><svg viewBox="0 0 600 400" className="absolute inset-0 size-full opacity-70" aria-hidden="true"><g fill="none" stroke="currentColor" className="text-border"><path d="M-20 80 C130 130 220 20 620 120" strokeWidth="8"/><path d="M-40 270 C140 190 310 350 640 235" strokeWidth="5"/><path d="M90 -20 C180 150 110 270 210 430" strokeWidth="4"/><path d="M470 -20 C390 100 500 210 430 430" strokeWidth="7"/></g></svg><div className="relative text-center"><MapPin className="mx-auto size-16 fill-gold-dark text-gold-light" /><p className="mt-3 font-display text-sm font-bold uppercase tracking-wide text-foreground">Perkam</p><p className="mt-1 text-xs text-muted-foreground">bei Straubing</p></div></div><p className="mt-4 text-center text-sm text-muted-foreground">Straubing 15 Min · Regensburg 35 Min · Landshut 45 Min · Deggendorf 35 Min</p></div></div></Reveal>

    <section className="bg-rauten"><Reveal className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-6"><Award className="mx-auto size-9 text-gold" /><h2 className="mt-5 font-display text-3xl font-extrabold uppercase tracking-wide text-foreground sm:text-5xl">Bereit für Ihr nächstes Auto?</h2><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild variant="gold"><Link to="/fahrzeuge">Fahrzeuge ansehen</Link></Button><Button asChild variant="silver"><Link to="/kontakt">Termin vereinbaren</Link></Button></div></Reveal></section>
  </>;
}