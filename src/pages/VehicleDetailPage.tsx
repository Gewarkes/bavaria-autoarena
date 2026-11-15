import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronRight, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { siteConfig } from "@/config/site";
import { formatFirstRegistration, formatFuel, formatKm, formatPrice, formatTransmission } from "@/lib/format";
import { coverImage, publicGallery, similarQuery, vehicleQuery } from "@/lib/vehicles";
import { openTermin } from "@/lib/termin";
import { sizedImage } from "@/lib/vehicleImages";

const route = getRouteApi("/fahrzeuge/$slug");
const phoneHref = siteConfig.phoneHref;

export function vehicleWhatsappUrl(title: string, price: number, url?: string) {
  const text = `Hallo, ich interessiere mich für den ${title} für ${formatPrice(price)}.${url ? ` ${url}` : ""}`;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export default function VehicleDetailPage() {
  const { slug } = route.useParams();
  const { data: v } = useSuspenseQuery(vehicleQuery(slug));
  const similar = useQuery({ ...similarQuery(v ?? { id: "", body_type: "", price_eur: 1 }), enabled: !!v });
  if (!v) return null;

  const isNew = !v.is_demo && Date.now() - new Date(v.created_at).getTime() < 14 * 86_400_000;
  const badge = v.status === "reserviert" ? <span className="rounded-md bg-warning px-3 py-1 text-xs font-bold text-primary-foreground">Reserviert</span>
     : isNew ? <span className="rounded bg-background/95 px-3 py-1 text-xs font-medium text-foreground">Neu eingetroffen</span> : null;
  const cover = coverImage(v);
  const termin = () => openTermin({ topic: "Probefahrt", vehicle: { id: v.id, title: v.title, price: formatPrice(v.price_eur), image: cover ? sizedImage(cover.url, "card") : undefined } });
  const wa = vehicleWhatsappUrl(v.title, v.price_eur);
  const phoneLabel = siteConfig.phone;

  const facts = [
    { label: "Erstzulassung", value: formatFirstRegistration(v.first_registration) }, { label: "Kilometer", value: formatKm(v.mileage_km) },
    { label: "Kraftstoff", value: formatFuel(v.fuel) }, { label: "Getriebe", value: formatTransmission(v.transmission) },
    ...(v.power_ps || v.power_kw ? [{ label: "Leistung", value: `${v.power_ps ?? "–"} PS / ${v.power_kw ?? "–"} kW` }] : []), { label: "Karosserie", value: v.body_type },
    ...(v.color ? [{ label: "Farbe", value: v.color }] : []), ...(v.hu_until ? [{ label: "HU", value: v.hu_until }] : []), ...(v.previous_owners != null ? [{ label: "Vorbesitzer", value: String(v.previous_owners) }] : []),
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">
      <nav aria-label="Brotkrumen" className="hidden flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:flex">
        <Link to="/" className="hover:text-tiffany-300">Start</Link><ChevronRight className="size-3.5" />
        <Link to="/fahrzeuge" className="hover:text-tiffany-300">Fahrzeuge</Link><ChevronRight className="size-3.5" />
        <span className="truncate text-foreground" aria-current="page">{v.title}</span>
      </nav>
      <Link to="/fahrzeuge" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:text-tiffany-300-light sm:mt-4"><ArrowLeft className="size-4" /><span className="sm:hidden">Alle Fahrzeuge</span><span className="hidden sm:inline">Zurück zur Übersicht</span></Link>

      <div className="mt-2 grid gap-8 sm:mt-6 lg:grid-cols-12 lg:gap-8">
        <div className="contents lg:col-span-8 lg:block lg:min-w-0 lg:space-y-10">
            <div className="order-1"><VehicleGallery images={publicGallery(v)} title={v.title} badge={badge} sealIndices={v.seal_indices} /></div>

          <section className="order-3"><h2 className="section-h2">Daten</h2><dl className="mt-6 grid grid-cols-2 border-t border-border sm:grid-cols-3">{facts.map(({ label, value }) => <div key={label} className="border-b border-border py-4 pr-4"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-semibold text-foreground">{value}</dd></div>)}</dl></section>

          {v.features.length ? <section className="order-4"><h2 className="section-h2">Ausstattung</h2><ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">{v.features.map((f) => <li key={f} className="flex items-center gap-3 text-foreground"><span className="grid size-6 shrink-0 place-items-center rounded-full border border-primary/50 text-primary"><Check className="size-3.5" /></span>{f}</li>)}</ul></section> : null}

            {v.description ? <section className="order-5"><h2 className="section-h2">Beschreibung</h2>{v.seal_indices.includes(v.cover_index ?? 0) ? <p className="mt-5 font-semibold text-foreground">Historienbericht vorhanden</p> : null}<p className="mt-5 max-w-3xl whitespace-pre-line leading-7 text-muted-foreground">{v.description}</p></section> : null}

          <section id="anfrage" className="order-7 scroll-mt-28 bg-ink-900 p-6 text-foreground md:p-10"><h2 className="section-h2">Noch Fragen zu diesem Auto?</h2><p className="mt-4 text-muted-foreground">Rufen Sie an, schreiben Sie per WhatsApp oder machen Sie gleich einen Termin aus.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"><Button asChild variant="brand"><a href={phoneHref}><Phone strokeWidth={1.5} />Anrufen</a></Button><Button type="button" variant="outline" className="border-foreground text-foreground" onClick={termin}>Probefahrt vereinbaren</Button><a href={wa} target="_blank" rel="noopener noreferrer" className="text-link gap-2 sm:ml-2"><MessageCircle className="size-4" strokeWidth={1.5} />Frage per WhatsApp</a></div><p className="mt-6 text-sm text-muted-foreground">Ihr bisheriges Auto nehmen wir gern in Zahlung – <Link to="/auto-verkaufen" search={{ wunschfahrzeug: v.id }} className="underline underline-offset-4">Bewertung anfragen</Link>.</p></section>

          <p className="order-8 text-xs leading-5 text-muted-foreground">Diese Seite dient der Information. Ein Kaufvertrag kommt ausschließlich vor Ort in unserem Autohaus oder nach individueller Absprache zustande. Eine verbindliche Reservierung ist über die Website nicht möglich.</p>
        </div>

        <aside className="order-2 lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <div className="border-b border-border pb-7 pt-1 lg:rounded-lg lg:border lg:bg-card lg:p-6">
             <h1 className="font-display text-2xl font-semibold leading-[1.15] text-foreground">{v.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">EZ {formatFirstRegistration(v.first_registration)} · {formatKm(v.mileage_km)} · {formatFuel(v.fuel)} · {formatTransmission(v.transmission)}{v.power_ps ? ` · ${v.power_ps} PS` : ""}</p>
             <p className="mt-5 font-display text-3xl font-bold text-foreground lg:mt-6 lg:text-4xl">{formatPrice(v.price_eur)}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{v.tax_status === "differenz" ? "Differenzbesteuert nach § 25a UStG, MwSt. nicht ausweisbar" : "inkl. 19 % MwSt., MwSt. ausweisbar"}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Finanzierung über Santander Consumer Bank oder DKB, Bonität vorausgesetzt.</p>
            {siteConfig.features.showMonthlyRate ? <p className="mt-3 text-sm text-foreground">Finanzierung auf Anfrage</p> : null}
            <div className="mt-6 grid gap-3">
              <Button asChild variant="brand" className="w-full"><a href={phoneHref}><Phone strokeWidth={1.5} />Anrufen · {phoneLabel}</a></Button>
              <Button type="button" className="w-full bg-ink-900 text-foreground hover:bg-ink-800" onClick={termin}>Probefahrt vereinbaren</Button>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="text-link justify-center gap-2 text-foreground"><MessageCircle className="size-4" strokeWidth={1.5} />Frage per WhatsApp</a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">{["Geprüft", "12 Monate Gewährleistung", "Inzahlungnahme möglich"].map((t) => <li key={t} className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" />{t}</li>)}</ul>
          </div>
        </aside>
      </div>

      {similar.data?.length ? <section className="mt-20"><h2 className="section-h2">Ähnliche Fahrzeuge</h2><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{similar.data.map((s) => <VehicleCard key={s.id} vehicle={s} />)}</div></section> : null}
    </div>
  );
}
