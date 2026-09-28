import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import serviceImage from "@/assets/service-autoschluessel.webp.asset.json";
import { Ornament } from "@/components/Ornament";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleImg } from "@/components/vehicles/VehicleImg";
import { mapsRouteUrl, phoneHref, siteConfig, whatsappHref } from "@/config/site";
import { formatFirstRegistration, formatKm, formatPrice, formatTransmission } from "@/lib/format";
import { sizedImage } from "@/lib/vehicleImages";
import { openTermin } from "@/lib/termin";
import { categories } from "@/lib/vehicleSearch";
import { coverImage, vehiclesQuery, type Vehicle } from "@/lib/vehicles";

const textLink = "tap-link font-display text-[13px] font-medium uppercase tracking-[.12em] underline decoration-current/50 underline-offset-[6px] transition-colors hover:text-gold-600";

function Heading({ eyebrow, children, dark = false, ornament = false }: { eyebrow: string; children: React.ReactNode; dark?: boolean; ornament?: boolean }) {
  return <div><p className={`eyebrow ${dark ? "text-gold-400" : "text-gold-700"}`}>{eyebrow}</p><h2 className={`section-h2 mt-4 ${dark ? "text-cream" : "text-navy-900"}`}>{children}</h2>{ornament ? <Ornament /> : null}</div>;
}

function Hero({ count }: { count: number }) {
  return <>
    <section className="flex flex-col bg-navy-900 text-cream lg:grid lg:h-[600px] lg:grid-cols-12 xl:h-[640px]">
      <div className="order-2 flex h-full items-center px-6 py-10 lg:order-1 lg:col-span-6 lg:py-0 lg:pb-16 lg:pl-[max(2.5rem,calc((100vw-1280px)/2+2.5rem))] lg:pr-10 2xl:col-span-5">
        <div className="min-w-0 max-w-[600px]"><p className="eyebrow text-gold-400">Autohaus in Perkam bei Straubing</p><h1 className="display-title mt-4 text-balance text-cream lg:!text-[52px] lg:!leading-[1.05] xl:!text-[56px]">Ihr nächstes Auto steht in Perkam.</h1><p className="mt-5 text-lg leading-[1.6] text-silver-200 lg:text-xl">Vom sparsamen Alltagsauto bis zum Sportwagen – ausgesucht, durchgesehen und vor Ort Probe zu fahren.</p><div className="mt-7 grid gap-3 lg:flex lg:flex-nowrap"><Button asChild variant="gold" className="w-full lg:w-auto 2xl:px-4 2xl:text-xs 2xl:tracking-[.08em]"><Link to="/fahrzeuge">Fahrzeuge ansehen ({count})</Link></Button><Button type="button" variant="outline" className="w-full border-cream text-cream lg:w-auto 2xl:px-4 2xl:text-xs 2xl:tracking-[.08em]" onClick={() => openTermin()}>Termin vereinbaren</Button></div></div>
      </div>
      <div className="order-1 aspect-[3/2] h-full overflow-hidden lg:order-2 lg:col-span-6 lg:aspect-auto 2xl:col-span-7"><img src="/hero-varianten/autohaus-audi-real-c.webp" alt="Dunkelgrüner Audi A5 Sportback vor der Bavaria Autoarena in Perkam" width="2400" height="1340" fetchPriority="high" className="size-full object-cover object-center lg:object-[58%_center]" /></div>
    </section>
    <ContactBand />
  </>;
}

function ContactBand() {
  const cells = [
    { label: "Festnetz", text: siteConfig.phone, href: phoneHref, icon: <Phone />, detail: "Termine nach Vereinbarung" },
    { label: "Mobil / WhatsApp", text: siteConfig.mobile, href: whatsappHref(), icon: <MessageCircle />, detail: "Nachricht schreiben" },
    { label: "Termin anfragen", text: "Probefahrt oder Besichtigung", href: "/kontakt#termin", icon: <MessageCircle />, detail: "Wir bestätigen kurz per Anruf." },
    { label: "Besuchen Sie uns", text: `${siteConfig.street}, ${siteConfig.zip} ${siteConfig.city}`, href: mapsRouteUrl, icon: <MapPin />, detail: "Route planen" },
  ];
  return <div className="relative z-10 bg-navy-900 text-cream lg:mx-auto lg:grid lg:max-w-[1280px] lg:grid-cols-4 lg:divide-x lg:divide-cream/10">{cells.map((cell, index) => <a key={cell.label} href={cell.href} onClick={index === 2 ? (event) => { event.preventDefault(); openTermin(); } : undefined} target={index === 1 || index === 3 ? "_blank" : undefined} rel={index === 1 || index === 3 ? "noopener noreferrer" : undefined} className="group grid min-h-16 grid-cols-[44px_minmax(0,1fr)_auto] items-center border-b border-cream/10 px-5 transition-colors hover:bg-navy-800 lg:block lg:border-0 lg:px-6 lg:py-8"><span className="grid size-11 place-items-center text-gold-400 lg:hidden [&_svg]:size-5">{cell.icon}</span><span className="min-w-0"><span className="eyebrow block text-gold-400">{cell.label}</span><span className={`mt-2 hidden font-display font-light lg:block ${index < 2 ? "text-xl" : "text-lg"}`}>{cell.text}</span><span className="block truncate text-sm lg:hidden">{cell.text}</span><span className="mt-2 hidden text-sm text-silver-400 lg:block">{cell.detail}</span></span><ChevronRight className="size-4 text-silver-400 lg:hidden" /></a>)}</div>;
}

function CurrentStock({ vehicles, onImageError }: { vehicles: Vehicle[]; onImageError: (vehicle: Vehicle) => void }) {
  const [active, setActive] = useState("alle");
  const matches = (vehicle: Vehicle, value: string) => value === "alle" || [...(categories.find((category) => category.value === value)?.bodyTypes ?? [])].some((bodyType) => bodyType === vehicle.body_type);
  const shown = active === "alle" ? vehicles : vehicles.filter((vehicle) => matches(vehicle, active));
  const chips = [{ value: "alle", label: "Alle" }, ...categories].map((category) => ({ ...category, count: vehicles.filter((vehicle) => matches(vehicle, category.value)).length })).filter((category) => category.value === "alle" || category.count > 0);
  return <section className="section-space bg-silver-100"><div className="page-container"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6"><Heading eyebrow="Unser Bestand">Aktuell bei uns</Heading><Link to="/fahrzeuge" className={`${textLink} hidden sm:inline-flex`}>Alle {vehicles.length} Fahrzeuge</Link></div><div className="hide-scrollbar mt-8 flex snap-x gap-7 overflow-x-auto border-y border-silver-300 py-3 lg:mt-12">{chips.map((chip) => <button key={chip.value} type="button" onClick={() => setActive(chip.value)} className={`min-h-11 shrink-0 border-b font-display text-sm uppercase tracking-[.08em] ${active === chip.value ? "border-gold-600 text-navy-900" : "border-transparent text-ink-500 hover:text-gold-700"}`}>{chip.label} <span>({chip.count})</span></button>)}</div><div className="hide-scrollbar -mx-6 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-1 md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-12 md:overflow-visible md:px-0 lg:mt-12 lg:grid-cols-3 lg:gap-x-8">{shown.slice(0, 6).map((vehicle, index) => <div key={vehicle.id} className="w-[82vw] shrink-0 snap-start md:w-auto"><VehicleCard vehicle={vehicle} eager={index < 3} onImageError={onImageError} /></div>)}</div><div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-silver-300 pt-7"><Link to="/fahrzeuge" className={`${textLink} sm:hidden`}>Alle {vehicles.length} Fahrzeuge</Link><p className="max-w-3xl text-ink-500">Nicht das Richtige dabei? Unser Bestand wechselt schnell – manches Auto ist verkauft, bevor es online steht.</p><Link to="/fahrzeuge" hash="suchauftrag" className={textLink}>Suchauftrag hinterlassen</Link></div></div></section>;
}

function Brands({ vehicles }: { vehicles: Vehicle[] }) {
  const counts = vehicles.reduce<Record<string, number>>((result, vehicle) => ({ ...result, [vehicle.brand]: (result[vehicle.brand] ?? 0) + 1 }), {});
  return <section className="section-space bg-silver-200"><div className="page-container"><Heading eyebrow="Marken im Bestand">Diese Marken stehen bei uns</Heading><div className="mt-8 grid grid-cols-2 gap-4 lg:mt-12 lg:grid-cols-4">{Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, "de")).map(([brand, count]) => <Link key={brand} to="/fahrzeuge" search={{ marke: brand }} className="flex min-h-24 flex-col justify-center border border-silver-300 bg-white p-6 transition-colors hover:border-gold-500"><span className="font-display text-lg font-normal uppercase text-navy-900">{brand}</span><span className="mt-1 block text-sm text-ink-500">{count} {count === 1 ? "Fahrzeug" : "Fahrzeuge"}</span></Link>)}<Link to="/fahrzeuge" className="group flex min-h-24 flex-col justify-center bg-navy-900 p-6 text-cream"><span className="font-display text-lg font-normal uppercase">Alle {vehicles.length} Fahrzeuge</span><span className="mt-2 h-px w-10 bg-gold-500 transition-[width] group-hover:w-20" /></Link></div></div></section>;
}

function Featured({ vehicle, onImageError }: { vehicle: Vehicle; onImageError: (vehicle: Vehicle) => void }) {
  const image = coverImage(vehicle);
  if (!image) return null;
  return <section className="section-space bg-warm-surface"><div className="page-container"><Heading eyebrow="Besondere Fahrzeuge">Ausgesucht &amp; besonders</Heading><div className="mt-8 grid items-stretch overflow-hidden lg:mt-12 lg:grid-cols-12"><Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }} className="group aspect-[4/3] overflow-hidden bg-[#D6D6D3] lg:col-span-7 lg:h-full lg:aspect-auto"><VehicleImg src={sizedImage(image.url, "full")} alt={image.alt || vehicle.title} width={1600} height={1200} loading="lazy" onError={() => onImageError(vehicle)} className="size-full object-cover object-center transition-transform duration-500 motion-safe:[@media(hover:hover)]:group-hover:scale-[1.03]" /></Link><div className="flex flex-col justify-center bg-navy-900 p-6 text-cream lg:col-span-5 lg:p-8 xl:p-10"><p className="eyebrow text-gold-400">{vehicle.brand}</p><h3 className="mt-3 font-display text-3xl font-normal leading-tight text-cream lg:text-4xl">{vehicle.model}</h3>{vehicle.title !== `${vehicle.brand} ${vehicle.model}` ? <p className="mt-2 text-silver-400">{vehicle.title}</p> : null}<dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-cream/10 py-5"><div><dt className="text-[13px] text-silver-400">Erstzulassung</dt><dd className="text-[15px]">{formatFirstRegistration(vehicle.first_registration)}</dd></div><div><dt className="text-[13px] text-silver-400">Kilometer</dt><dd className="text-[15px]">{formatKm(vehicle.mileage_km)}</dd></div><div><dt className="text-[13px] text-silver-400">Leistung</dt><dd className="text-[15px]">{vehicle.power_ps ? `${vehicle.power_ps} PS` : "–"}</dd></div><div><dt className="text-[13px] text-silver-400">Getriebe</dt><dd className="text-[15px]">{formatTransmission(vehicle.transmission)}</dd></div></dl><p className="mt-5 font-display text-[26px] font-medium tabular-nums">{formatPrice(vehicle.price_eur)}</p><div className="mt-5 grid gap-3 xl:grid-cols-2"><Button asChild variant="gold" className="w-full px-6 xl:min-w-[200px]"><Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }}>Fahrzeug ansehen</Link></Button><Button type="button" variant="outline" className="w-full border-cream px-6 text-cream xl:min-w-[200px]" onClick={() => openTermin({ topic: "Probefahrt", vehicle: { id: vehicle.id, title: vehicle.title, price: formatPrice(vehicle.price_eur), image: sizedImage(image.url, "card") } })}>Probefahrt anfragen</Button></div></div></div></div></section>;
}

function HistoryBand() {
  return <section className="bg-navy-900 py-10 text-cream"><div className="page-container grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]"><p className="max-w-4xl text-lg leading-[1.65] text-silver-200">Für viele unserer Fahrzeuge liegt ein Fahrzeughistorienbericht von carVertical vor – erkennbar am Siegel im Foto. Fragen Sie uns danach, wir zeigen Ihnen den Bericht vor Ort oder senden ihn zu.</p><Button type="button" variant="outline" className="w-full border-cream text-cream lg:w-auto" onClick={() => openTermin()}>Fahrzeug anfragen</Button></div></section>;
}

function Services() {
  const services = ["Ihr altes Auto nehmen wir in Zahlung", "Finanzierung über Santander und DKB", "Zulassung – Sie holen das Auto mit Kennzeichen ab", "Lieferung bis vor die Haustür", "Export mit Ausfuhrkennzeichen", "12 Monate Gewährleistung für Privatkunden"];
  return <section className="relative bg-navy-950 pb-20 md:pb-0"><div className="h-[440px] w-full overflow-hidden md:h-[560px] lg:h-[640px]"><img src={serviceImage.url} alt="Hand mit Autoschlüssel vor einem dunklen Fahrzeug" width="2000" height="1333" loading="lazy" className="size-full -scale-x-100 object-cover object-left" /></div><div className="page-container relative z-10 -mt-16 md:absolute md:inset-x-0 md:top-1/2 md:mt-0 md:-translate-y-1/2"><div className="bg-service-rauten bg-gold-500 p-8 text-navy-900 md:w-[520px] md:p-12"><p className="eyebrow text-navy-900/70">Rund ums Auto</p><h2 className="section-h2 mt-4">Was wir für Sie erledigen</h2><ul className="mt-8 divide-y divide-navy-900/15">{services.map((service) => <li key={service} className="py-3 font-display text-[17px]">{service}</li>)}</ul><Link to="/leistungen" className={`${textLink} mt-6`}>Alle Leistungen</Link></div></div></section>;
}

function TestimonialsSection() {
  return <section className="section-space bg-navy-900 text-cream"><div className="page-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"><Heading eyebrow="Bewertungen" dark>Von Kunden bewertet</Heading><div><p className="text-lg text-silver-200">4,7 von 5 Sternen · 85 Bewertungen auf mobile.de</p><a href={siteConfig.reviewsUrl} target="_blank" rel="noopener noreferrer" className={`${textLink} mt-5 inline-flex text-gold-400`}>Alle Bewertungen ansehen</a></div></div></section>;
}

function MapArtwork() {
  return <div className="relative min-h-[420px] overflow-hidden bg-silver-200"><svg viewBox="0 0 700 500" className="absolute inset-0 size-full" aria-hidden="true"><g fill="none" stroke="currentColor" className="text-silver-300"><path d="M-20 95C120 160 250 35 730 135" strokeWidth="20" /><path d="M-30 365C160 245 360 450 740 310" strokeWidth="12" /><path d="M120-20C215 170 120 345 260 540" strokeWidth="9" /></g><path d="M0 275C170 220 355 285 700 190" fill="none" stroke="currentColor" className="text-gold-500" strokeWidth="4" strokeDasharray="10 8" /></svg><div className="absolute left-[54%] top-[42%] grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-navy-900 text-gold-400"><MapPin strokeWidth={1.5} /></div></div>;
}

export default function HomePage() {
  const { data: vehicles } = useSuspenseQuery(vehiclesQuery({}));
  const [brokenVehicleIds, setBrokenVehicleIds] = useState<Set<string>>(() => new Set());
  const visibleVehicles = vehicles.filter((vehicle) => !brokenVehicleIds.has(vehicle.id));
  const markImageBroken = (vehicle: Vehicle) => setBrokenVehicleIds((previous) => previous.has(vehicle.id) ? previous : new Set(previous).add(vehicle.id));
  const featured = visibleVehicles.find((vehicle) => vehicle.is_highlight || vehicle.price_eur >= 40000);
  return <>
    <Hero count={visibleVehicles.length} />
    <CurrentStock vehicles={visibleVehicles} onImageError={markImageBroken} />
    <Brands vehicles={visibleVehicles} />
    {featured ? <Featured vehicle={featured} onImageError={markImageBroken} /> : null}
    <HistoryBand />
    <section className="section-space bg-silver-100"><div className="page-container grid gap-12 lg:grid-cols-12 lg:items-center"><div className="lg:col-span-5"><Heading eyebrow="Ankauf & Inzahlungnahme">Wir kaufen Ihr Auto</Heading><p className="mt-8 max-w-[52ch] text-lg leading-[1.65] text-navy-900/80">Ob Sie verkaufen oder auf ein Auto von uns anrechnen wollen: Sie schicken uns ein paar Angaben, wir melden uns am nächsten Werktag mit einem Preis.</p><Button asChild variant="gold" className="mt-8 w-full sm:w-auto"><Link to="/auto-verkaufen">Auto bewerten lassen</Link></Button></div><div className="aspect-[4/3] overflow-hidden bg-[#D6D6D3] lg:col-span-7"><VehicleImg src="https://img.classistatic.de/api/v1/mo-prod/images/65/65594664-fed2-4381-939b-048d6c7c7cda?rule=mo-1600.jpg" alt="Roter Ford Focus ST-Line" width={1200} height={900} loading="lazy" className="size-full object-cover object-center" /></div></div></section>
    <Services />
    <section className="section-space bg-silver-100"><div className="page-container grid gap-12 lg:grid-cols-2"><div><Heading eyebrow="Grüß Gott" ornament>Willkommen bei Bavaria Autoarena</Heading><p className="mt-8 max-w-[680px] text-lg leading-[1.6] text-navy-900/80 lg:text-xl">Seit 2018 sind wir im Gebrauchtwagenhandel tätig. Aus der Bavaria Autoarena Straubing hervorgegangen, finden Sie uns seit 2026 in der Gewerbestraße 7 in Perkam.</p></div><ul className="divide-y divide-silver-300 border-y border-silver-300 text-lg text-navy-900 lg:self-end">{["Seit 2018 am Markt", "Probefahrt nach Termin", "Inzahlungnahme möglich"].map((fact) => <li key={fact} className="py-5 font-display">{fact}</li>)}</ul></div></section>
    <TestimonialsSection />
    <section className="section-space bg-silver-100"><div className="page-container grid gap-12 lg:grid-cols-2 lg:items-center"><div><Heading eyebrow="Anfahrt">So finden Sie uns</Heading><p className="mt-8 max-w-[54ch] text-lg leading-[1.65] text-navy-900/80">{siteConfig.name}, {siteConfig.street}, {siteConfig.zip} {siteConfig.city}. Zur Probefahrt bitte den Führerschein mitbringen.</p><p className="mt-6 border-y border-silver-300 py-4 text-lg text-navy-900">{siteConfig.appointmentHours}</p><Button asChild variant="gold" className="mt-8 w-full sm:w-auto"><a href={mapsRouteUrl} target="_blank" rel="noopener noreferrer">Route planen</a></Button></div><MapArtwork /></div></section>
  </>;
}