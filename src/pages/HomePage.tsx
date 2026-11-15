import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, ChevronRight, MapPin, MessageCircle, Navigation, Phone, Star } from "lucide-react";
import { useState } from "react";
import heroImage from "@/assets/autohaus-tag-klar.webp.asset.json";
import heroSmallImage from "@/assets/autohaus-tag-klar-1280.webp.asset.json";
import heroMobileImage from "@/assets/autohaus-tag-klar-mobil.webp.asset.json";
import ankaufImage from "@/assets/ankauf-bewertung.webp";
import serviceImage from "@/assets/service-schluesseluebergabe.webp";
import { Ornament } from "@/components/Ornament";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleImg } from "@/components/vehicles/VehicleImg";
import { mapsRouteUrl, phoneHref, siteConfig, whatsappHref } from "@/config/site";
import { formatFirstRegistration, formatKm, formatPrice, formatTransmission } from "@/lib/format";
import { sizedImage } from "@/lib/vehicleImages";
import { openTermin } from "@/lib/termin";
import { categories } from "@/lib/vehicleSearch";
import { coverImage, vehiclesQuery, type Vehicle } from "@/lib/vehicles";

const textLink = "tap-link font-display text-[13px] font-medium uppercase tracking-[.14em] text-primary underline decoration-current/40 underline-offset-[6px] transition-colors hover:text-tiffany-300";

function Heading({ eyebrow, children, ornament = false }: { eyebrow: string; children: React.ReactNode; ornament?: boolean }) {
  return <div><p className="eyebrow text-primary">{eyebrow}</p><h2 className="section-h2 mt-4 text-foreground">{children}</h2><span aria-hidden="true" className="brand-line mt-6 block h-px w-16" />{ornament ? <Ornament /> : null}</div>;
}

function Hero({ count, videoSrc }: { count: number; videoSrc?: string }) {
  const value = siteConfig.rating.value.toLocaleString("de-DE");
  const facts = [<>{value} <Star aria-hidden="true" className="inline size-3.5 -translate-y-px fill-current text-primary" strokeWidth={1.5} /> auf {siteConfig.rating.source}</>, <>Finanzierung über Santander und DKB</>, <>Abwicklung aus einer Hand</>];
  const alt = "Foto des Autohauses Bavaria Autoarena in Perkam bei Tageslicht, Original-Logo als Visualisierung mittig über dem Rolltor";
  return <section className="relative isolate flex flex-col overflow-hidden bg-ink-950 text-foreground lg:h-[92vh] lg:min-h-[680px] lg:max-h-[1080px] lg:justify-end">
    <div className="relative h-[55svh] min-h-[420px] w-full md:h-[60svh] lg:absolute lg:inset-0 lg:-z-10 lg:h-auto lg:min-h-0">
      {videoSrc ? <video className="size-full object-cover object-left-top" src={videoSrc} poster={heroImage.url} autoPlay muted loop playsInline aria-hidden="true" /> : <picture className="block size-full">
        <source media="(max-width: 767px)" srcSet={heroMobileImage.url} width={960} height={1200} />
        <img src={heroImage.url} srcSet={`${heroSmallImage.url} 1280w, ${heroImage.url} 2560w`} sizes="100vw" alt={alt} width={2560} height={1440} fetchPriority="high" decoding="async" className="size-full object-cover object-top lg:object-fill" />
      </picture>}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--ink-950)_75%,transparent),transparent_20%)] lg:bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--ink-950)_75%,transparent)_0%,color-mix(in_oklab,var(--ink-950)_65%,transparent)_9%,transparent_17%),linear-gradient(to_top,color-mix(in_oklab,var(--ink-950)_85%,transparent)_0%,color-mix(in_oklab,var(--ink-950)_85%,transparent)_43%,transparent_60%)]" />
    </div>
    <div className="page-container relative py-10 lg:pb-8 lg:pt-0">
      <div className="max-w-[640px] lg:max-w-[720px]">
        <p className="eyebrow text-primary">Bavaria Autoarena · Perkam bei Straubing</p>
        <h1 className="mt-5 text-balance font-display text-[40px] font-light leading-[1.05] text-foreground md:text-[60px] lg:mt-3 lg:text-[64px]">Die <span className="text-primary">Arena</span> für Ihr nächstes Auto.</h1>
        <p className="mt-6 max-w-[46ch] text-lg leading-[1.6] text-foreground/85 lg:mt-3 lg:max-w-[64ch]">Ausgesuchte Gebrauchtwagen vom Alltagsauto bis zum Sportwagen – mit Finanzierung, Inzahlungnahme und Zulassung aus einer Hand.</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8 lg:mt-4"><Button asChild variant="brand" className="w-full sm:w-auto"><Link to="/fahrzeuge">Fahrzeuge ansehen ({count})</Link></Button><button type="button" onClick={() => openTermin()} className="group inline-flex min-h-11 items-center justify-center gap-2 font-display text-[13px] font-medium uppercase tracking-[.15em] text-foreground transition-colors hover:text-tiffany-300">Termin vereinbaren<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} /></button></div>
        <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-foreground/75 sm:gap-x-0 lg:mt-4">{facts.map((fact, i) => <li key={i} className="whitespace-nowrap">{i ? <span aria-hidden="true" className="mx-2.5 hidden text-subtle sm:inline">·</span> : null}{fact}</li>)}</ul>
      </div>
    </div>
    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-border" />
  </section>;
}

function KeyFigures({ count }: { count: number }) {
  const figures = [
    { value: `${siteConfig.rating.value.toLocaleString("de-DE")} ★`, label: `${siteConfig.rating.count} Bewertungen auf ${siteConfig.rating.source}` },
    { value: "Finanzierung", label: "über Santander und DKB", word: true },
    { value: "Aus einer Hand", label: "Inzahlungnahme, Zulassung, Lieferung", word: true },
    { value: String(count), label: "Fahrzeuge sofort verfügbar", accent: true },
  ];
  return <section aria-label="Kennzahlen" className="border-b border-border bg-background"><dl className="page-container grid grid-cols-2 lg:grid-cols-4">{figures.map((f, i) => <div key={f.label} className={`flex flex-col-reverse gap-3 border-border py-10 lg:py-16 ${i % 2 ? "border-l pl-5 lg:pl-8" : "pr-5"} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""}`}><dt className="text-[15px] text-muted-foreground">{f.label}</dt><dd className={`font-display ${"word" in f ? "whitespace-nowrap text-[20px] sm:text-[28px] lg:text-[32px]" : "text-[34px] lg:text-[56px]"} font-light leading-none tabular-nums ${f.accent ? "text-primary" : "text-foreground"}`}>{f.value}</dd></div>)}</dl></section>;
}

function CurrentStock({ vehicles, onImageError }: { vehicles: Vehicle[]; onImageError: (vehicle: Vehicle) => void }) {
  const [active, setActive] = useState("alle");
  const matches = (vehicle: Vehicle, value: string) => value === "alle" || [...(categories.find((category) => category.value === value)?.bodyTypes ?? [])].some((bodyType) => bodyType === vehicle.body_type);
  const shown = active === "alle" ? vehicles : vehicles.filter((vehicle) => matches(vehicle, active));
  const chips = [{ value: "alle", label: "Alle" }, ...categories].map((category) => ({ ...category, count: vehicles.filter((vehicle) => matches(vehicle, category.value)).length })).filter((category) => category.value === "alle" || category.count > 0);
  return <section id="bestand" className="section-space scroll-mt-24 bg-ink-900"><div className="page-container"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6"><div><Heading eyebrow="Unser Bestand">Aktuell in der Arena</Heading><p className="mt-4 text-lg text-muted-foreground"><span className="brand-text font-display text-2xl font-normal tabular-nums">{vehicles.length}</span> Fahrzeuge sofort verfügbar</p></div><Link to="/fahrzeuge" className={`${textLink} hidden sm:inline-flex`}>Alle {vehicles.length} Fahrzeuge ansehen</Link></div><div className="hide-scrollbar mt-8 flex snap-x gap-7 overflow-x-auto border-y border-border py-3 lg:mt-12">{chips.map((chip) => <button key={chip.value} type="button" onClick={() => setActive(chip.value)} className={`min-h-11 shrink-0 border-b font-display text-sm uppercase tracking-[.08em] ${active === chip.value ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-tiffany-300"}`}>{chip.label} <span>({chip.count})</span></button>)}</div><div className="hide-scrollbar -mx-6 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-1 md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-12 md:overflow-visible md:px-0 lg:mt-12 lg:grid-cols-3 lg:gap-x-8">{shown.slice(0, 6).map((vehicle, index) => <div key={vehicle.id} className="w-[82vw] shrink-0 snap-start md:w-auto"><VehicleCard vehicle={vehicle} eager={index < 3} onImageError={onImageError} /></div>)}</div><div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7"><Link to="/fahrzeuge" className={`${textLink} sm:hidden`}>Alle {vehicles.length} Fahrzeuge ansehen</Link><p className="max-w-3xl text-muted-foreground">Nicht das Richtige dabei? Unser Bestand wechselt schnell – manches Auto ist verkauft, bevor es online steht.</p><Link to="/fahrzeuge" hash="suchauftrag" className={textLink}>Suchauftrag hinterlassen</Link></div></div></section>;
}

function Featured({ vehicle, onImageError }: { vehicle: Vehicle; onImageError: (vehicle: Vehicle) => void }) {
  const image = coverImage(vehicle);
  if (!image) return null;
  return <section className="section-space bg-background"><div className="page-container"><Heading eyebrow="Highlight">Ausgesucht und besonders</Heading><div className="mt-8 grid items-stretch overflow-hidden lg:mt-12 lg:grid-cols-[3fr_2fr]"><Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }} className="group aspect-[4/3] overflow-hidden bg-image-placeholder lg:h-full lg:min-h-[520px] lg:aspect-auto"><VehicleImg src={sizedImage(image.url, "full")} alt={image.alt || vehicle.title} width={1600} height={1200} loading="lazy" onError={() => onImageError(vehicle)} className="size-full object-cover object-center transition-transform duration-500 motion-safe:[@media(hover:hover)]:group-hover:scale-[1.03]" /></Link><div className="flex flex-col justify-center border border-border bg-card p-6 text-foreground lg:p-10 xl:p-12"><p className="eyebrow text-primary">{vehicle.brand}</p><h3 className="mt-3 font-display text-3xl font-normal leading-tight text-foreground lg:text-4xl">{vehicle.model}</h3>{vehicle.title !== `${vehicle.brand} ${vehicle.model}` ? <p className="mt-2 text-muted-foreground">{vehicle.title}</p> : null}<dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-foreground/10 py-5"><div><dt className="text-[13px] text-muted-foreground">Erstzulassung</dt><dd className="text-[15px]">{formatFirstRegistration(vehicle.first_registration)}</dd></div><div><dt className="text-[13px] text-muted-foreground">Kilometer</dt><dd className="text-[15px]">{formatKm(vehicle.mileage_km)}</dd></div><div><dt className="text-[13px] text-muted-foreground">Leistung</dt><dd className="text-[15px]">{vehicle.power_ps ? `${vehicle.power_ps} PS` : "–"}</dd></div><div><dt className="text-[13px] text-muted-foreground">Getriebe</dt><dd className="text-[15px]">{formatTransmission(vehicle.transmission)}</dd></div></dl><p className="mt-7 font-display text-[40px] font-semibold leading-none tabular-nums lg:text-[52px]">{formatPrice(vehicle.price_eur)}</p><p className="mt-1 text-xs text-muted-foreground">{vehicle.tax_status === "differenz" ? "Endpreis, differenzbesteuert nach § 25a UStG" : "Endpreis inkl. MwSt., MwSt. ausweisbar"}</p><div className="mt-7 grid gap-3"><Button asChild variant="brand" className="w-full px-6"><Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }}>Fahrzeug ansehen</Link></Button><Button type="button" variant="outline" className="w-full px-6" onClick={() => openTermin({ topic: "Probefahrt", vehicle: { id: vehicle.id, title: vehicle.title, price: formatPrice(vehicle.price_eur), image: sizedImage(image.url, "card") } })}>Probefahrt anfragen</Button></div></div></div></div></section>;
}

function TradeIn() {
  const steps = ["Angaben schicken", "Preis am nächsten Werktag", "Verkauf oder Inzahlungnahme"];
  return <section className="section-space bg-ink-900"><div className="page-container grid gap-12 lg:grid-cols-12 lg:items-center"><div className="aspect-[4/3] overflow-hidden bg-image-placeholder lg:order-2 lg:col-span-7"><img src={ankaufImage} alt="Fahrzeugbewertung mit Tablet an einer dunklen Karosserie" width={1600} height={1200} loading="lazy" className="size-full object-cover object-center" /></div><div className="lg:order-1 lg:col-span-5"><Heading eyebrow="Ankauf & Inzahlungnahme">Wir kaufen Ihr Auto. Direkt.</Heading><p className="mt-8 max-w-[52ch] text-lg leading-[1.65] text-muted-foreground">Ob Sie verkaufen oder auf ein Auto von uns anrechnen wollen: Sie schicken uns ein paar Angaben, wir melden uns am nächsten Werktag mit einem Preis.</p><ol className="mt-8 divide-y divide-border border-y border-border">{steps.map((step, index) => <li key={step} className="flex items-baseline gap-5 py-4"><span className="font-display text-sm tabular-nums text-primary">{String(index + 1).padStart(2, "0")}</span><span className="font-display text-lg font-light uppercase tracking-[.06em]">{step}</span></li>)}</ol><Button asChild variant="brand" className="mt-8 w-full sm:w-auto"><Link to="/auto-verkaufen">Auto bewerten lassen</Link></Button></div></div></section>;
}

function Services() {
  const services = ["Inzahlungnahme Ihres Fahrzeugs", "Finanzierung über Santander und DKB", "Zulassung – Sie holen Ihr Auto mit Kennzeichen ab", "Lieferung bis vor die Haustür", "Export mit Ausfuhrkennzeichen"];
  return <section className="section-space bg-background"><div className="page-container grid gap-12 lg:grid-cols-12 lg:items-center"><div className="aspect-[4/3] overflow-hidden bg-image-placeholder lg:col-span-6 lg:aspect-[4/5]"><img src={serviceImage} alt="Übergabe eines Autoschlüssels vor einem dunklen Fahrzeug" width={1200} height={1504} loading="lazy" className="size-full object-cover object-center" /></div><div className="lg:col-span-6 lg:pl-6"><Heading eyebrow="Rund um den Kauf">Alles aus einer Hand.</Heading><ol className="mt-8 divide-y divide-border border-y border-border lg:mt-12">{services.map((service, index) => <li key={service} className="flex items-baseline gap-6 py-4"><span className="font-display text-sm tabular-nums text-primary">{String(index + 1).padStart(2, "0")}</span><span className="font-display text-[17px] font-light lg:text-lg">{service}</span></li>)}</ol><p className="mt-6 max-w-[60ch] text-[15px] leading-[1.6] text-subtle">Für viele unserer Fahrzeuge liegt ein Fahrzeughistorienbericht von carVertical vor – erkennbar am Siegel im Foto. Fragen Sie uns danach, wir zeigen Ihnen den Bericht vor Ort oder senden ihn zu.</p><Link to="/leistungen" className={`${textLink} mt-6`}>Alle Leistungen</Link></div></div></section>;
}

function About() {
  return <section className="section-space bg-ink-900"><div className="page-container grid gap-12 lg:grid-cols-2"><div><Heading eyebrow="Grüß Gott" ornament>Zuhause in Perkam.</Heading><p className="mt-8 max-w-[640px] text-lg leading-[1.6] text-muted-foreground lg:text-xl">Seit 2018 sind wir im Gebrauchtwagenhandel tätig. Aus der Bavaria Autoarena Straubing hervorgegangen, finden Sie uns seit 2026 in der Gewerbestraße 7 in Perkam.</p><Link to="/ueber-uns" className={`${textLink} mt-6`}>Über uns</Link></div><ul className="divide-y divide-border border-y border-border text-lg lg:self-end">{["Seit 2018 am Markt", "Probefahrt nach Termin", "Inzahlungnahme möglich"].map((fact) => <li key={fact} className="py-5 font-display font-light uppercase tracking-[.06em]">{fact}</li>)}</ul></div></section>;
}

function Ratings() {
  const value = siteConfig.rating.value.toLocaleString("de-DE");
  return <section className="section-space bg-background"><div className="page-container grid gap-10 lg:grid-cols-12 lg:items-center"><div className="border border-border bg-card p-8 lg:col-span-5 lg:p-12"><p className="text-primary font-display text-[96px] font-light leading-none tabular-nums lg:text-[150px]">{value}</p><div className="mt-5 flex gap-1.5 text-primary" role="img" aria-label={`${value} von 5 Sternen`}>{[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`size-6 ${i < 4 ? "fill-current" : "fill-primary/30"}`} strokeWidth={1.5} />)}</div><p className="mt-5 text-[15px] text-muted-foreground">{siteConfig.rating.count} Bewertungen auf {siteConfig.rating.source} · Stand 09/2026</p></div><div className="lg:col-span-6 lg:col-start-7"><Heading eyebrow="Bewertungen">{value} von 5. Von Kunden bewertet.</Heading><p className="mt-8 max-w-[52ch] text-lg leading-[1.65] text-muted-foreground">Alle Einträge können Sie direkt auf {siteConfig.rating.source} nachlesen.</p><a href={siteConfig.reviewsUrl} target="_blank" rel="noopener noreferrer" className={`${textLink} mt-6`}>Alle Bewertungen ansehen</a></div></div></section>;
}

function Visit() {
  const actions = [
    { label: "Anrufen", text: siteConfig.phone, href: phoneHref, icon: Phone },
    { label: "WhatsApp", text: siteConfig.mobile, href: whatsappHref(), icon: MessageCircle, external: true },
    { label: "Route planen", text: `${siteConfig.zip} ${siteConfig.city}`, href: mapsRouteUrl, icon: Navigation, external: true },
  ];
  return <section className="section-space bg-ink-900"><div className="page-container grid gap-12 lg:grid-cols-12 lg:items-center"><div className="lg:col-span-6"><Heading eyebrow="Anfahrt">Besuchen Sie uns in der Arena.</Heading><p className="mt-8 font-display text-2xl font-light leading-snug text-foreground lg:text-3xl">{siteConfig.street}<br />{siteConfig.zip} {siteConfig.city}</p><p className="mt-5 max-w-[54ch] text-lg leading-[1.65] text-muted-foreground">{siteConfig.appointmentHours}. Zur Probefahrt bitte den Führerschein mitbringen.</p><ul className="mt-8 divide-y divide-border border-y border-border">{actions.map(({ label, text, href, icon: Icon, external }) => <li key={label}><a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="group flex min-h-16 items-center gap-5 py-3 transition-colors"><Icon className="size-5 shrink-0 text-primary" strokeWidth={1.5} /><span className="eyebrow w-32 shrink-0 text-subtle">{label}</span><span className="min-w-0 truncate font-display text-lg font-light transition-colors group-hover:text-tiffany-300">{text}</span><ChevronRight className="ml-auto size-4 shrink-0 text-subtle transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.5} /></a></li>)}</ul><Button type="button" variant="brand" className="mt-8 w-full sm:w-auto" onClick={() => openTermin()}><CalendarDays strokeWidth={1.5} />Termin vereinbaren</Button></div><div className="lg:col-span-6"><MapArtwork /></div></div></section>;
}

function MapArtwork() {
  return <div className="relative min-h-[360px] overflow-hidden border border-border bg-ink-800 lg:min-h-[420px]"><svg viewBox="0 0 700 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true"><g fill="none" stroke="currentColor" className="text-foreground/10"><path d="M-20 95C120 160 250 35 730 135" strokeWidth="20" /><path d="M-30 365C160 245 360 450 740 310" strokeWidth="12" /><path d="M120-20C215 170 120 345 260 540" strokeWidth="9" /></g><path d="M0 275C170 220 355 285 700 190" fill="none" stroke="currentColor" className="text-primary" strokeWidth="3" strokeDasharray="10 8" /></svg><div className="absolute left-[54%] top-[42%] grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary bg-ink-950 text-primary"><MapPin strokeWidth={1.5} /></div></div>;
}

export default function HomePage() {
  const { data: vehicles } = useSuspenseQuery(vehiclesQuery({}));
  const [brokenVehicleIds, setBrokenVehicleIds] = useState<Set<string>>(() => new Set());
  const visibleVehicles = vehicles.filter((vehicle) => !brokenVehicleIds.has(vehicle.id));
  const markImageBroken = (vehicle: Vehicle) => setBrokenVehicleIds((previous) => previous.has(vehicle.id) ? previous : new Set(previous).add(vehicle.id));
  const featured = visibleVehicles.find((vehicle) => vehicle.is_highlight || vehicle.price_eur >= 40000);
  return <>
    <Hero count={visibleVehicles.length} />
    <KeyFigures count={visibleVehicles.length} />
    <CurrentStock vehicles={visibleVehicles} onImageError={markImageBroken} />
    {featured ? <Reveal><Featured vehicle={featured} onImageError={markImageBroken} /></Reveal> : null}
    <Reveal><TradeIn /></Reveal>
    <Reveal><Services /></Reveal>
    <Reveal><About /></Reveal>
    <Reveal><Ratings /></Reveal>
    <Visit />
  </>;
}
