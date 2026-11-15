import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import serviceImage from "@/assets/service-autoschluessel.webp.asset.json";
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
  return <div><p className="eyebrow text-primary">{eyebrow}</p><h2 className="section-h2 mt-4 text-foreground">{children}</h2>{ornament ? <Ornament /> : null}</div>;
}

function Hero({ count }: { count: number }) {
  return <>
    <section className="relative isolate flex h-[78svh] min-h-[520px] flex-col justify-end overflow-hidden bg-ink-950 text-foreground lg:h-[88vh] lg:min-h-[620px] lg:max-h-[860px] lg:justify-end">
      <picture className="absolute inset-0 -z-10">
        <source media="(max-width: 767px)" srcSet="/hero-autohaus-mobil.webp" width={1000} height={893} />
        <source media="(max-width: 1279px)" srcSet="/hero-autohaus-1200.webp 1200w, /hero-autohaus.webp 2400w" sizes="100vw" width={1200} height={670} />
        <img src="/hero-autohaus.webp" alt="Bavaria Autoarena in Perkam – Ausstellungshalle mit dunkelgrünem Audi A5 Sportback" width={2400} height={1340} fetchPriority="high" decoding="async" className="size-full object-cover object-[62%_center] lg:object-[60%_center]" />
      </picture>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--ink-950)_0%,color-mix(in_oklab,var(--ink-950)_85%,transparent)_55%,color-mix(in_oklab,var(--ink-950)_35%,transparent)_85%,transparent_100%)] lg:bg-[linear-gradient(to_right,color-mix(in_oklab,var(--ink-950)_92%,transparent)_0%,color-mix(in_oklab,var(--ink-950)_55%,transparent)_42%,transparent_68%),linear-gradient(to_top,color-mix(in_oklab,var(--ink-950)_70%,transparent),transparent_35%)]" />
      <div className="page-container pb-10 lg:pb-24">
        <div className="max-w-[640px]"><p className="eyebrow text-primary">Autohaus in Perkam bei Straubing</p><h1 className="display-title mt-5 text-balance text-foreground">Ihr nächstes Auto steht in Perkam.</h1><p className="mt-6 max-w-[52ch] text-lg leading-[1.6] text-foreground/80 lg:text-xl">Vom sparsamen Alltagsauto bis zum Sportwagen – ausgesucht, durchgesehen und vor Ort Probe zu fahren.</p><div className="mt-8 grid gap-3 sm:flex sm:flex-wrap"><Button asChild variant="brand" className="w-full sm:w-auto"><Link to="/fahrzeuge">Fahrzeuge ansehen ({count})</Link></Button><Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => openTermin()}>Termin vereinbaren</Button></div></div>
      </div>
      <div aria-hidden="true" className="brand-line absolute inset-x-0 bottom-0 h-px" />
    </section>
    <ContactBand />
  </>;
}

function ContactBand() {
  const cells = [
    { label: "Festnetz", text: siteConfig.phone, href: phoneHref, icon: <Phone />, detail: "Termine nach Vereinbarung" },
    { label: "Mobil / WhatsApp", text: siteConfig.mobile, href: whatsappHref(), icon: <MessageCircle />, detail: "Nachricht schreiben" },
    { label: "Termin anfragen", text: "Probefahrt oder Besichtigung", href: "/kontakt#termin", icon: <ChevronRight />, detail: "Wir bestätigen kurz per Anruf." },
    { label: "Besuchen Sie uns", text: `${siteConfig.street}, ${siteConfig.zip} ${siteConfig.city}`, href: mapsRouteUrl, icon: <MapPin />, detail: "Route planen" },
  ];
  return <div className="border-b border-border bg-ink-950 text-foreground"><div className="lg:mx-auto lg:grid lg:max-w-[1280px] lg:grid-cols-4 lg:divide-x lg:divide-border">{cells.map((cell, index) => <a key={cell.label} href={cell.href} onClick={index === 2 ? (event) => { event.preventDefault(); openTermin(); } : undefined} target={index === 1 || index === 3 ? "_blank" : undefined} rel={index === 1 || index === 3 ? "noopener noreferrer" : undefined} className="group grid min-h-16 grid-cols-[44px_minmax(0,1fr)_auto] items-center border-b border-border px-5 transition-colors hover:bg-ink-900 lg:block lg:border-0 lg:px-8 lg:py-8"><span className="grid size-11 place-items-center text-primary lg:hidden [&_svg]:size-5">{cell.icon}</span><span className="min-w-0"><span className="eyebrow block text-primary">{cell.label}</span><span className={`mt-2 hidden font-display font-light transition-colors group-hover:text-tiffany-300 lg:block ${index < 2 ? "text-xl" : "text-lg"}`}>{cell.text}</span><span className="block truncate text-sm lg:hidden">{cell.text}</span><span className="mt-2 hidden text-sm text-subtle lg:block">{cell.detail}</span></span><ChevronRight className="size-4 text-subtle lg:hidden" /></a>)}</div></div>;
}

function BrandMarquee({ vehicles }: { vehicles: Vehicle[] }) {
  const brands = [...new Set(vehicles.map((vehicle) => vehicle.brand))].sort((a, b) => a.localeCompare(b, "de"));
  if (!brands.length) return null;
  const row = (hidden: boolean) => <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">{brands.map((brand) => <li key={brand} className="flex items-center"><Link to="/fahrzeuge" search={{ marke: brand }} tabIndex={hidden ? -1 : undefined} className="tap-link px-8 font-display text-lg font-light uppercase tracking-[.24em] text-subtle transition-colors hover:text-tiffany-300 lg:px-12 lg:text-xl">{brand}</Link><span aria-hidden="true" className="size-1.5 rotate-45 bg-primary/40" /></li>)}</ul>;
  return <section aria-label="Marken im Bestand" className="group overflow-hidden border-b border-border bg-background py-6 lg:py-8"><div className="marquee flex w-max group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">{row(false)}{row(true)}</div></section>;
}

function CurrentStock({ vehicles, onImageError }: { vehicles: Vehicle[]; onImageError: (vehicle: Vehicle) => void }) {
  const [active, setActive] = useState("alle");
  const matches = (vehicle: Vehicle, value: string) => value === "alle" || [...(categories.find((category) => category.value === value)?.bodyTypes ?? [])].some((bodyType) => bodyType === vehicle.body_type);
  const shown = active === "alle" ? vehicles : vehicles.filter((vehicle) => matches(vehicle, active));
  const chips = [{ value: "alle", label: "Alle" }, ...categories].map((category) => ({ ...category, count: vehicles.filter((vehicle) => matches(vehicle, category.value)).length })).filter((category) => category.value === "alle" || category.count > 0);
  return <section className="section-space bg-ink-900"><div className="page-container"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6"><div><Heading eyebrow="Unser Bestand">Aktuell bei uns</Heading><p className="mt-4 text-lg text-muted-foreground"><span className="brand-text font-display text-2xl font-normal tabular-nums">{vehicles.length}</span> Fahrzeuge sofort verfügbar</p></div><Link to="/fahrzeuge" className={`${textLink} hidden sm:inline-flex`}>Alle {vehicles.length} Fahrzeuge ansehen</Link></div><div className="hide-scrollbar mt-8 flex snap-x gap-7 overflow-x-auto border-y border-border py-3 lg:mt-12">{chips.map((chip) => <button key={chip.value} type="button" onClick={() => setActive(chip.value)} className={`min-h-11 shrink-0 border-b font-display text-sm uppercase tracking-[.08em] ${active === chip.value ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-tiffany-300"}`}>{chip.label} <span>({chip.count})</span></button>)}</div><div className="hide-scrollbar -mx-6 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-1 md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-12 md:overflow-visible md:px-0 lg:mt-12 lg:grid-cols-3 lg:gap-x-8">{shown.slice(0, 6).map((vehicle, index) => <div key={vehicle.id} className="w-[82vw] shrink-0 snap-start md:w-auto"><VehicleCard vehicle={vehicle} eager={index < 3} onImageError={onImageError} /></div>)}</div><div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7"><Link to="/fahrzeuge" className={`${textLink} sm:hidden`}>Alle {vehicles.length} Fahrzeuge ansehen</Link><p className="max-w-3xl text-muted-foreground">Nicht das Richtige dabei? Unser Bestand wechselt schnell – manches Auto ist verkauft, bevor es online steht.</p><Link to="/fahrzeuge" hash="suchauftrag" className={textLink}>Suchauftrag hinterlassen</Link></div></div></section>;
}

function Featured({ vehicle, onImageError }: { vehicle: Vehicle; onImageError: (vehicle: Vehicle) => void }) {
  const image = coverImage(vehicle);
  if (!image) return null;
  return <section className="section-space bg-background"><div className="page-container"><Heading eyebrow="Besondere Fahrzeuge">Ausgesucht &amp; besonders</Heading><div className="mt-8 grid items-stretch overflow-hidden lg:mt-12 lg:grid-cols-12"><Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }} className="group aspect-[4/3] overflow-hidden bg-image-placeholder lg:col-span-7 lg:h-full lg:aspect-auto"><VehicleImg src={sizedImage(image.url, "full")} alt={image.alt || vehicle.title} width={1600} height={1200} loading="lazy" onError={() => onImageError(vehicle)} className="size-full object-cover object-center transition-transform duration-500 motion-safe:[@media(hover:hover)]:group-hover:scale-[1.03]" /></Link><div className="flex flex-col justify-center border border-border bg-card p-6 text-foreground lg:col-span-5 lg:p-8 xl:p-10"><p className="eyebrow text-primary">{vehicle.brand}</p><h3 className="mt-3 font-display text-3xl font-normal leading-tight text-foreground lg:text-4xl">{vehicle.model}</h3>{vehicle.title !== `${vehicle.brand} ${vehicle.model}` ? <p className="mt-2 text-muted-foreground">{vehicle.title}</p> : null}<dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-foreground/10 py-5"><div><dt className="text-[13px] text-muted-foreground">Erstzulassung</dt><dd className="text-[15px]">{formatFirstRegistration(vehicle.first_registration)}</dd></div><div><dt className="text-[13px] text-muted-foreground">Kilometer</dt><dd className="text-[15px]">{formatKm(vehicle.mileage_km)}</dd></div><div><dt className="text-[13px] text-muted-foreground">Leistung</dt><dd className="text-[15px]">{vehicle.power_ps ? `${vehicle.power_ps} PS` : "–"}</dd></div><div><dt className="text-[13px] text-muted-foreground">Getriebe</dt><dd className="text-[15px]">{formatTransmission(vehicle.transmission)}</dd></div></dl><p className="mt-5 font-display text-[26px] font-medium tabular-nums">{formatPrice(vehicle.price_eur)}</p><div className="mt-5 grid gap-3 xl:grid-cols-2"><Button asChild variant="brand" className="w-full px-6 xl:min-w-[200px]"><Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }}>Fahrzeug ansehen</Link></Button><Button type="button" variant="outline" className="w-full px-6 xl:min-w-[200px]" onClick={() => openTermin({ topic: "Probefahrt", vehicle: { id: vehicle.id, title: vehicle.title, price: formatPrice(vehicle.price_eur), image: sizedImage(image.url, "card") } })}>Probefahrt anfragen</Button></div></div></div></div></section>;
}

function TradeIn() {
  const steps = ["Angaben schicken", "Preis am nächsten Werktag", "Verkauf oder Inzahlungnahme"];
  return <section className="section-space bg-ink-900"><div className="page-container grid gap-12 lg:grid-cols-12 lg:items-center"><div className="aspect-[4/3] overflow-hidden bg-image-placeholder lg:order-2 lg:col-span-7"><VehicleImg src="https://img.classistatic.de/api/v1/mo-prod/images/65/65594664-fed2-4381-939b-048d6c7c7cda?rule=mo-1600.jpg" alt="Roter Ford Focus ST-Line" width={1200} height={900} loading="lazy" className="size-full object-cover object-center" /></div><div className="lg:order-1 lg:col-span-5"><Heading eyebrow="Ankauf & Inzahlungnahme">Wir kaufen Ihr Auto</Heading><p className="mt-8 max-w-[52ch] text-lg leading-[1.65] text-muted-foreground">Ob Sie verkaufen oder auf ein Auto von uns anrechnen wollen: Sie schicken uns ein paar Angaben, wir melden uns am nächsten Werktag mit einem Preis.</p><ol className="mt-8 divide-y divide-border border-y border-border">{steps.map((step, index) => <li key={step} className="flex items-baseline gap-5 py-4"><span className="font-display text-sm tabular-nums text-primary">{String(index + 1).padStart(2, "0")}</span><span className="font-display text-lg font-light uppercase tracking-[.06em]">{step}</span></li>)}</ol><Button asChild variant="brand" className="mt-8 w-full sm:w-auto"><Link to="/auto-verkaufen">Auto bewerten lassen</Link></Button></div></div></section>;
}

function Services() {
  const services = ["Ihr altes Auto nehmen wir in Zahlung", "Finanzierung über Santander und DKB", "Zulassung – Sie holen das Auto mit Kennzeichen ab", "Lieferung bis vor die Haustür", "Export mit Ausfuhrkennzeichen", "12 Monate Gewährleistung für Privatkunden"];
  return <section className="bg-rauten section-space bg-background"><div className="page-container grid gap-12 lg:grid-cols-12 lg:items-center"><div className="aspect-[4/3] overflow-hidden bg-image-placeholder lg:col-span-6 lg:aspect-[4/5]"><img src={serviceImage.url} alt="Hand mit Autoschlüssel vor einem dunklen Fahrzeug" width="2000" height="1333" loading="lazy" className="size-full -scale-x-100 object-cover object-[30%_center]" /></div><div className="lg:col-span-6 lg:pl-6"><Heading eyebrow="Rund ums Auto">Was wir für Sie erledigen</Heading><ol className="mt-8 divide-y divide-border border-y border-border lg:mt-12">{services.map((service, index) => <li key={service} className="flex items-baseline gap-6 py-4"><span className="font-display text-sm tabular-nums text-primary">{String(index + 1).padStart(2, "0")}</span><span className="font-display text-[17px] font-light lg:text-lg">{service}</span></li>)}</ol><p className="mt-6 max-w-[60ch] text-[15px] leading-[1.6] text-subtle">Für viele unserer Fahrzeuge liegt ein Fahrzeughistorienbericht von carVertical vor – erkennbar am Siegel im Foto. Fragen Sie uns danach, wir zeigen Ihnen den Bericht vor Ort oder senden ihn zu.</p><Link to="/leistungen" className={`${textLink} mt-6`}>Alle Leistungen</Link></div></div></section>;
}

function About() {
  return <section className="section-space bg-ink-900"><div className="page-container grid gap-12 lg:grid-cols-2"><div><Heading eyebrow="Grüß Gott" ornament>Willkommen bei Bavaria Autoarena</Heading><p className="mt-8 max-w-[640px] text-lg leading-[1.6] text-muted-foreground lg:text-xl">Seit 2018 sind wir im Gebrauchtwagenhandel tätig. Aus der Bavaria Autoarena Straubing hervorgegangen, finden Sie uns seit 2026 in der Gewerbestraße 7 in Perkam.</p><Link to="/ueber-uns" className={`${textLink} mt-6`}>Über uns</Link></div><ul className="divide-y divide-border border-y border-border text-lg lg:self-end">{["Seit 2018 am Markt", "Probefahrt nach Termin", "Inzahlungnahme möglich"].map((fact) => <li key={fact} className="py-5 font-display font-light uppercase tracking-[.06em]">{fact}</li>)}</ul></div></section>;
}

function Ratings() {
  return <section className="section-space bg-background"><div className="page-container grid gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-20"><p className="brand-text font-display text-[88px] font-light leading-none tabular-nums lg:text-[140px]">{siteConfig.rating.value.toLocaleString("de-DE")}</p><div><p className="eyebrow text-primary">Bewertungen</p><h2 className="section-h2 mt-4">Von Kunden bewertet</h2><p className="mt-5 text-lg text-muted-foreground">{siteConfig.rating.value.toLocaleString("de-DE")} von 5 Sternen · {siteConfig.rating.count} Bewertungen auf {siteConfig.rating.source}</p><a href={siteConfig.reviewsUrl} target="_blank" rel="noopener noreferrer" className={`${textLink} mt-5`}>Alle Bewertungen ansehen</a></div></div></section>;
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
    <BrandMarquee vehicles={visibleVehicles} />
    <CurrentStock vehicles={visibleVehicles} onImageError={markImageBroken} />
    {featured ? <Reveal><Featured vehicle={featured} onImageError={markImageBroken} /></Reveal> : null}
    <Reveal><TradeIn /></Reveal>
    <Reveal><Services /></Reveal>
    <Reveal><About /></Reveal>
    <Reveal><Ratings /></Reveal>
    <section className="section-space bg-ink-900"><div className="page-container grid gap-12 lg:grid-cols-2 lg:items-center"><div><Heading eyebrow="Anfahrt">So finden Sie uns</Heading><p className="mt-8 max-w-[54ch] text-lg leading-[1.65] text-muted-foreground">{siteConfig.name}, {siteConfig.street}, {siteConfig.zip} {siteConfig.city}. Zur Probefahrt bitte den Führerschein mitbringen.</p><p className="mt-6 border-y border-border py-4 text-lg">{siteConfig.appointmentHours}</p><Button asChild variant="brand" className="mt-8 w-full sm:w-auto"><a href={mapsRouteUrl} target="_blank" rel="noopener noreferrer">Route planen</a></Button></div><MapArtwork /></div></section>
  </>;
}
