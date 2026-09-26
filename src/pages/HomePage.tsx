import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { Ornament } from "@/components/Ornament";
import { Button } from "@/components/ui/button";
import { VehicleCard, VehicleCardSkeleton } from "@/components/vehicles/VehicleCard";
import { VehicleImg } from "@/components/vehicles/VehicleImg";
import { mapsRouteUrl, openingRows, phoneHref, siteConfig, whatsappHref } from "@/config/site";
import { formatFirstRegistration, formatKm, formatPrice } from "@/lib/format";
import { sizedImage } from "@/lib/vehicleImages";
import { testimonialsQuery, vehiclesQuery, type Vehicle } from "@/lib/vehicles";

const textLink = "tap-link font-display text-[13px] font-medium uppercase tracking-[.16em] underline decoration-current/50 underline-offset-[6px] transition-colors hover:text-gold-600";

function Heading({ eyebrow, children, dark = false, center = false }: { eyebrow: string; children: React.ReactNode; dark?: boolean; center?: boolean }) {
  return <div className={center ? "text-center" : ""}><p className={`eyebrow ${dark ? "text-gold-400" : "text-gold-700"}`}>{eyebrow}</p><h2 className={`section-h2 mt-4 ${dark ? "text-cream" : "text-navy-900"}`}>{children}</h2><Ornament className={center ? "mx-auto" : ""} /></div>;
}

function Hero({ count }: { count: number }) {
  return <>
    <section className="relative bg-silver-100 lg:h-[calc(100svh-88px)] lg:min-h-[600px] lg:max-h-[920px]">
      <picture className="block h-[46svh] min-h-[340px] lg:absolute lg:inset-0 lg:h-full">
        <source type="image/webp" srcSet="/hero-911-1280.webp 1280w, /hero-911-1920.webp 1920w, /hero-911-2560.webp 2560w" sizes="100vw" />
        <img src="/hero-911-1920.jpg" srcSet="/hero-911-1280.jpg 1280w, /hero-911-1920.jpg 1920w, /hero-911-2560.jpg 2560w" sizes="100vw" alt="Schwarzer Porsche 911 auf einem Parkdeck vor Bergkulisse" width="2560" height="1708" fetchPriority="high" className="size-full object-cover object-[62%_78%] lg:object-[50%_72%]" />
      </picture>
      <div className="page-container relative bg-silver-100 py-12 lg:bg-transparent lg:pt-[8vh]">
        <div className="max-w-[680px]"><p className="eyebrow text-gold-700">Autohaus in Perkam bei Straubing</p><h1 className="display-title mt-4 text-navy-900">Ihr nächstes Auto steht in Perkam.</h1><p className="mt-6 max-w-[650px] text-xl leading-[1.5] text-navy-900/80">Vom sparsamen Alltagsauto bis zum Sportwagen – persönlich ausgesucht, vor dem Verkauf durchgesehen und bei uns vor Ort Probe zu fahren.</p><div className="mt-8 grid gap-3 sm:flex"><Button asChild variant="gold"><Link to="/fahrzeuge">Fahrzeuge ansehen ({count})</Link></Button><Button asChild variant="outline" className="border-navy-900 text-navy-900"><Link to="/kontakt" hash="termin">Termin vereinbaren</Link></Button></div></div>
      </div>
    </section>
    <ContactBand />
  </>;
}

function ContactBand() {
  const cells = [
    { label: "Anrufen", text: siteConfig.phone, href: phoneHref, icon: <Phone />, detail: "Mo–Fr 9–18 · Sa 9–13 Uhr" },
    { label: "Termin vereinbaren", text: "Probefahrt oder Besichtigung", href: "/kontakt#termin", icon: <MessageCircle />, detail: "Wir melden uns am selben Tag." },
    { label: "Besuchen Sie uns", text: `${siteConfig.street}, ${siteConfig.zip} ${siteConfig.city}`, href: mapsRouteUrl, icon: <MapPin />, detail: "Route planen" },
  ];
  return <div className="relative z-10 bg-navy-900 text-cream md:-mt-14 md:mx-auto md:grid md:max-w-[1120px] md:grid-cols-3 md:divide-x md:divide-cream/10">{cells.map((cell, index) => <a key={cell.label} href={cell.href} target={index === 2 ? "_blank" : undefined} rel={index === 2 ? "noopener noreferrer" : undefined} className="group grid min-h-16 grid-cols-[44px_1fr_auto] items-center border-b border-cream/10 px-5 transition-colors hover:bg-navy-800 md:block md:min-h-0 md:border-0 md:px-8 md:py-8 lg:px-10"><span className="grid size-11 place-items-center text-gold-400 md:hidden [&_svg]:size-5">{cell.icon}</span><span><span className="eyebrow block text-gold-400">{cell.label}</span><span className={`mt-2 hidden font-display font-light md:block ${index === 0 ? "text-[26px]" : "text-lg"}`}>{cell.text}</span><span className="block text-sm text-cream md:hidden">{cell.text}</span><span className="mt-2 hidden text-sm text-silver-400 md:block">{cell.detail}</span></span><ChevronRight className="size-4 text-silver-400 md:hidden" /></a>)}</div>;
}

function Brands({ brands }: { brands: string[] }) {
  return <div className="hide-scrollbar mt-14 flex overflow-x-auto bg-navy-800 px-5 py-7 text-silver-300/70 md:justify-center md:px-8">{brands.map((brand, index) => <span key={brand} className="flex shrink-0 items-center"><Link to="/fahrzeuge" search={{ marke: brand }} className="font-display text-[15px] font-normal uppercase tracking-[.28em] hover:text-gold-400">{brand}</Link>{index < brands.length - 1 ? <i className="mx-5 size-1.5 rotate-45 bg-gold-500" /> : null}</span>)}</div>;
}

function Featured({ vehicle }: { vehicle: Vehicle }) {
  const image = vehicle.images[0];
  if (!image) return null;
  return <section className="section-space bg-navy-950 text-cream"><div className="page-container"><Heading eyebrow="Besondere Fahrzeuge" dark>Für den Sonntag</Heading><Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }} className="group relative mt-10 block aspect-video overflow-hidden md:aspect-[21/9]"><VehicleImg src={sizedImage(image.url, "full")} alt={image.alt || vehicle.title} width={1600} height={900} className="size-full origin-bottom scale-[1.06] object-cover object-[50%_100%]" /><div className="absolute inset-y-0 left-0 w-[72%] bg-navy-950/80 md:w-[55%]" /><div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-end p-6 md:p-12"><p className="eyebrow text-gold-400">{vehicle.brand}</p><h3 className="display-title mt-2 text-cream">{vehicle.model}</h3><p className="mt-4 text-sm text-silver-300">EZ {formatFirstRegistration(vehicle.first_registration)} · {formatKm(vehicle.mileage_km)} · {vehicle.power_ps} PS</p><p className="mt-5 font-display text-3xl font-light tabular-nums">{formatPrice(vehicle.price_eur)}</p><span className={`${textLink} mt-5 w-fit text-cream`}>Ansehen</span></div></Link></div></section>;
}

function CurrentStock({ vehicles }: { vehicles: Vehicle[] }) {
  const categories = [
    ["Für jeden Tag", "Limousine"], ["Für die Familie", "Van"], ["SUV & Allrad", "SUV"], ["Sportlich & Besonderes", "Coupé"], ["Camper", "Camper"],
  ] as const;
  return <section className="section-space bg-silver-200"><div className="page-container"><div className="flex flex-wrap items-end justify-between gap-6"><Heading eyebrow="Unser Bestand">Aktuell bei uns</Heading><Link to="/fahrzeuge" className={textLink}>Alle {vehicles.length} Fahrzeuge</Link></div><div className="hide-scrollbar mt-10 flex gap-7 overflow-x-auto border-y border-silver-300 py-5">{categories.map(([label, type]) => { const count = vehicles.filter((v) => type === "Coupé" ? ["Coupé", "Cabrio", "Sportwagen"].includes(v.body_type) || v.price_eur >= 40000 : type === "Van" ? ["Van", "Bus"].includes(v.body_type) : v.body_type === type).length; return count ? <Link key={label} to="/fahrzeuge" search={{ karosserie: type }} className="shrink-0 font-display text-sm uppercase tracking-[.08em] text-navy-900 hover:text-gold-700">{label} <span className="ml-1 text-ink-500">({count})</span></Link> : null; })}</div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{vehicles.length ? vehicles.slice(0, 6).map((vehicle, index) => <VehicleCard key={vehicle.id} vehicle={vehicle} eager={index < 3} />) : Array.from({ length: 6 }, (_, index) => <VehicleCardSkeleton key={index} />)}</div><div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-silver-300 pt-7"><p className="max-w-3xl text-ink-500">Nicht das Richtige dabei? Unser Bestand wechselt schnell – manches Auto ist verkauft, bevor es online steht.</p><Link to="/fahrzeuge" hash="suchauftrag" className={textLink}>Suchauftrag hinterlassen</Link></div></div></section>;
}

function Services() {
  const services = ["Ihr altes Auto nehmen wir in Zahlung", "Finanzierung über Santander und DKB", "Zulassung – Sie holen das Auto mit Kennzeichen ab", "Lieferung bis vor die Haustür", "Export mit Ausfuhrkennzeichen", "12 Monate Gewährleistung für Privatkunden"];
  return <section className="relative bg-navy-950 pb-20 md:pb-0"><img src="/service-halle.webp" alt="Porsche-Raddetail in einer dunklen Halle" width="2400" height="1597" loading="lazy" className="h-[440px] w-full object-cover md:h-[560px] lg:h-[640px]" /><div className="bg-service-rauten relative z-10 mx-5 -mt-16 bg-gold-500 p-8 text-navy-900 md:absolute md:left-[8%] md:top-1/2 md:mx-0 md:mt-0 md:w-[520px] md:-translate-y-1/2 md:p-12 lg:p-14"><p className="eyebrow text-navy-900/70">Rund ums Auto</p><h2 className="section-h2 mt-4">Was wir für Sie erledigen</h2><ul className="mt-8 divide-y divide-navy-900/15">{services.map((service) => <li key={service} className="py-3 font-display text-[17px] font-normal">{service}</li>)}</ul><Link to="/leistungen" className={`${textLink} mt-6`}>Alle Leistungen</Link></div></section>;
}

function TestimonialsSection({ vehicles }: { vehicles: Vehicle[] }) {
  const { data = [] } = useQuery(testimonialsQuery());
  const images = vehicles.flatMap((v) => v.images.slice(0, 1)).slice(0, 4);
  return <section className="section-space bg-navy-900 text-cream"><div className="page-container grid gap-14 lg:grid-cols-2 lg:items-center"><div className="grid grid-cols-2 gap-2">{images.map((image, index) => <div key={`${image.url}-${index}`} className="aspect-square overflow-hidden bg-navy-800"><VehicleImg src={sizedImage(image.url, "card")} alt={image.alt || "Auto bei Bavaria Autoarena"} width={640} height={640} loading="lazy" className="size-full origin-bottom scale-[1.06] object-cover object-[50%_100%]" /></div>)}</div><div><Heading eyebrow="Bewertungen" dark>Was unsere Kunden schreiben</Heading><div className="mt-9 divide-y divide-cream/10">{data.slice(0, 3).map((testimonial) => <figure key={testimonial.id} className="py-6 first:pt-0"><span className="block h-12 font-display text-7xl font-light leading-none text-gold-500">“</span><blockquote className="text-[19px] italic leading-[1.55] text-cream">{testimonial.text}</blockquote><figcaption className="mt-4"><span className="eyebrow text-gold-400">{testimonial.author}</span><span className="ml-3 text-sm text-silver-400">Bewertung auf mobile.de</span></figcaption></figure>)}</div><p className="mt-7 text-sm text-silver-400">4,7 von 5 Sternen · 85 Bewertungen auf mobile.de (Stand 09/2026)</p><a href={siteConfig.mobileDeUrl} target="_blank" rel="noopener noreferrer" className={`${textLink} mt-3 text-cream`}>Alle ansehen</a></div></div></section>;
}

function MapArtwork() {
  return <div className="relative min-h-[420px] overflow-hidden bg-silver-200"><svg viewBox="0 0 700 500" className="absolute inset-0 size-full" aria-hidden="true"><g fill="none" stroke="currentColor" className="text-silver-300"><path d="M-20 95C120 160 250 35 730 135" strokeWidth="20" /><path d="M-30 365C160 245 360 450 740 310" strokeWidth="12" /><path d="M120-20C215 170 120 345 260 540" strokeWidth="9" /><path d="M560-20C430 130 600 300 470 540" strokeWidth="16" /></g><path d="M0 275C170 220 355 285 700 190" fill="none" stroke="currentColor" className="text-gold-500" strokeWidth="4" strokeDasharray="10 8" /></svg><div className="absolute left-[54%] top-[42%] grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-navy-900 text-gold-400"><MapPin strokeWidth={1.5} /></div><div className="absolute bottom-8 left-8 bg-navy-900 px-5 py-4 text-cream"><p className="eyebrow text-gold-400">Bavaria Autoarena</p><p className="mt-1 text-sm text-silver-300">Perkam bei Straubing</p></div></div>;
}

export default function HomePage() {
  const { data: vehicles = [], isPending } = useQuery(vehiclesQuery({}));
  const brands = [...new Set(vehicles.map((v) => v.brand))].sort((a, b) => a.localeCompare(b, "de"));
  const featured = vehicles.find((v) => v.is_highlight || v.price_eur >= 40000);
  const discovery = vehicles.find((v) => /land rover|discovery/i.test(`${v.brand} ${v.model}`)) ?? vehicles[5];
  const discoveryImage = discovery?.images[0];
  const today = new Intl.DateTimeFormat("de-DE", { weekday: "long", timeZone: "Europe/Berlin" }).format(new Date());
  return <>
    <Hero count={vehicles.length} />
    <section className="bg-navy-900 pt-32 text-center text-cream"><div className="page-container"><Heading eyebrow="Grüß Gott" dark center>Willkommen bei Bavaria Autoarena</Heading><p className="mx-auto mt-8 max-w-[52ch] text-[17px] leading-[1.65] text-silver-400">Wir sind ein inhabergeführtes Autohaus in der Gewerbestraße 7 in Perkam, eine Viertelstunde von Straubing. Bei uns finden Sie das günstige Auto für den Weg in die Arbeit genauso wie den Wagen, auf den Sie lange gespart haben – und beim Kleinwagen nehmen wir uns genauso viel Zeit wie beim Sportwagen.</p></div><Brands brands={brands} /></section>
    {featured ? <Featured vehicle={featured} /> : null}
    <CurrentStock vehicles={vehicles} />
    <Services />
    <section className="section-space bg-silver-100"><div className="page-container grid gap-12 lg:grid-cols-12 lg:items-center"><div className="lg:col-span-5"><Heading eyebrow="Ankauf & Inzahlungnahme">Wir kaufen Ihr Auto</Heading><p className="mt-8 max-w-[52ch] text-[17px] text-navy-900/80">Ob Sie verkaufen oder auf ein Auto von uns anrechnen wollen: Sie schicken uns ein paar Angaben, wir melden uns am nächsten Werktag mit einem Preis.</p><div className="mt-8 flex flex-wrap items-center gap-6"><Button asChild variant="gold"><Link to="/auto-verkaufen">Auto bewerten lassen</Link></Button><a href={whatsappHref("Hallo Bavaria Autoarena, ich möchte Fotos von meinem Auto schicken.")} target="_blank" rel="noopener noreferrer" className={textLink}>Fotos per WhatsApp schicken</a></div></div><div className="lg:col-span-7">{discoveryImage ? <VehicleImg src={sizedImage(discoveryImage.url, "full")} alt={discoveryImage.alt || "Auto aus dem Bestand"} width={1200} height={800} loading="lazy" className="aspect-3/2 size-full object-cover" /> : <div className="aspect-3/2 bg-silver-200" />}</div></div></section>
    <TestimonialsSection vehicles={vehicles} />
    <section className="section-space bg-silver-100"><div className="page-container grid gap-12 lg:grid-cols-2 lg:items-center"><div><Heading eyebrow="Anfahrt">So finden Sie uns</Heading><p className="mt-8 max-w-[54ch] text-[17px] text-navy-900/80">Gewerbestraße 7, 94368 Perkam. Von Straubing sind es 15 Minuten, von Regensburg und Deggendorf gut eine halbe Stunde. Zur Probefahrt bitte den Führerschein mitbringen.</p><table className="mt-8 w-full max-w-md text-base"><tbody>{openingRows.map(([label, key]) => <tr key={key} className={`border-b border-silver-300 ${today.toLowerCase() === label.toLowerCase() ? "font-semibold" : ""}`}><th className="py-3 text-left font-normal text-ink-500">{label}</th><td className="py-3 text-right tabular-nums text-navy-900">{siteConfig.openingHours[key]}</td></tr>)}</tbody></table><div className="mt-8 flex flex-wrap gap-3"><Button asChild variant="gold"><a href={phoneHref}>Anrufen</a></Button><Button asChild variant="outline" className="border-navy-900 text-navy-900"><a href={mapsRouteUrl} target="_blank" rel="noopener noreferrer">Route planen</a></Button></div></div><MapArtwork /></div></section>
    {isPending ? <span className="sr-only">Bestand wird geladen</span> : null}
  </>;
}