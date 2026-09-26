import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { VehicleInquiryForm } from "@/components/forms/InquiryForm";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { siteConfig } from "@/config/site";
import { formatFirstRegistration, formatFuel, formatKm, formatPrice, formatTransmission } from "@/lib/format";
import { similarQuery, vehicleQuery } from "@/lib/vehicles";

const route = getRouteApi("/fahrzeuge/$slug");
const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;
type Kind = "probefahrt" | "anfrage" | "rueckruf";

export function vehicleWhatsappUrl(title: string, price: number, url: string) {
  const text = `Hallo, ich interessiere mich für ${title} (${formatPrice(price)}) – ${url}`;
  return `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export default function VehicleDetailPage() {
  const { slug } = route.useParams();
  const { data: v } = useSuspenseQuery(vehicleQuery(slug));
  const [kind, setKind] = useState<Kind>("anfrage");
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => { setPageUrl(window.location.href); }, [slug]);
  const similar = useQuery({ ...similarQuery(v ?? { id: "", body_type: "", price_eur: 1 }), enabled: !!v });
  if (!v) return null;

  const isNew = !v.is_demo && Date.now() - new Date(v.created_at).getTime() < 14 * 86_400_000;
  const badge = v.status === "reserviert" ? <span className="rounded-md bg-warning px-3 py-1 text-xs font-bold text-primary-foreground">Reserviert</span>
     : isNew ? <span className="rounded bg-background/95 px-3 py-1 text-xs font-medium text-foreground">Neu eingetroffen</span> : null;
  const goToForm = (k: Kind) => { setKind(k); document.getElementById("anfrage")?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  const facts = [
    { label: "Erstzulassung", value: formatFirstRegistration(v.first_registration) }, { label: "Kilometer", value: formatKm(v.mileage_km) },
    { label: "Kraftstoff", value: formatFuel(v.fuel) }, { label: "Getriebe", value: formatTransmission(v.transmission) },
    ...(v.power_ps || v.power_kw ? [{ label: "Leistung", value: `${v.power_ps ?? "–"} PS / ${v.power_kw ?? "–"} kW` }] : []), { label: "Karosserie", value: v.body_type },
    ...(v.color ? [{ label: "Farbe", value: v.color }] : []), ...(v.hu_until ? [{ label: "HU", value: v.hu_until }] : []), ...(v.previous_owners != null ? [{ label: "Vorbesitzer", value: String(v.previous_owners) }] : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-6">
      <nav aria-label="Brotkrumen" className="hidden flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:flex">
        <Link to="/" className="hover:text-gold">Start</Link><ChevronRight className="size-3.5" />
        <Link to="/fahrzeuge" className="hover:text-gold">Fahrzeuge</Link><ChevronRight className="size-3.5" />
        <span className="truncate text-foreground" aria-current="page">{v.title}</span>
      </nav>
      <Link to="/fahrzeuge" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light sm:mt-4"><ArrowLeft className="size-4" /><span className="sm:hidden">Alle Fahrzeuge</span><span className="hidden sm:inline">Zurück zur Übersicht</span></Link>

      <div className="mt-2 grid gap-8 sm:mt-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
        <div className="contents lg:block lg:min-w-0 lg:space-y-10">
          <div className="order-1"><VehicleGallery images={v.images} title={v.title} badge={badge} /></div>

          <aside className="order-2 lg:hidden"><div className="border-b border-border pb-7 pt-1"><h1 className="font-display text-2xl font-semibold leading-[1.15] text-foreground">{v.title}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">EZ {formatFirstRegistration(v.first_registration)} · {formatKm(v.mileage_km)} · {formatFuel(v.fuel)} · {formatTransmission(v.transmission)}{v.power_ps ? ` · ${v.power_ps} PS` : ""}</p><p className="mt-5 font-display text-3xl font-bold text-foreground">{formatPrice(v.price_eur)}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{v.tax_status === "differenz" ? "Differenzbesteuert nach § 25a UStG, MwSt. nicht ausweisbar" : "inkl. 19 % MwSt., MwSt. ausweisbar"}</p><Button variant="gold" className="mt-5 w-full" onClick={() => goToForm("probefahrt")}>Probefahrt anfragen</Button><div className="mt-2 grid grid-cols-2 gap-2 text-sm"><a className="tap-link justify-center text-silver underline underline-offset-4 hover:text-gold" href={phoneHref}>Anrufen</a><a className="tap-link justify-center text-silver underline underline-offset-4 hover:text-gold" href={vehicleWhatsappUrl(v.title, v.price_eur, pageUrl)} target="_blank" rel="noopener noreferrer">WhatsApp</a></div></div></aside>

          <section className="order-3"><h2 className="section-h2">Daten</h2><dl className="mt-6 grid grid-cols-2 border-t border-border sm:grid-cols-3">{facts.map(({ label, value }) => <div key={label} className="border-b border-border py-4 pr-4"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-semibold text-foreground">{value}</dd></div>)}</dl></section>

          {v.features.length ? <section className="order-4"><h2 className="section-h2">Ausstattung</h2><ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">{v.features.map((f) => <li key={f} className="flex items-center gap-3 text-foreground"><span className="grid size-6 shrink-0 place-items-center rounded-full border border-gold/50 text-gold"><Check className="size-3.5" /></span>{f}</li>)}</ul></section> : null}

          {v.description ? <section className="order-5"><h2 className="section-h2">Beschreibung</h2><p className="mt-5 max-w-3xl whitespace-pre-line leading-7 text-muted-foreground">{v.description}</p></section> : null}

          <section className="order-6 border-y border-border py-7"><h2 className="text-lg font-semibold text-foreground">Ihr Auto in Zahlung geben?</h2><p className="mt-2 text-sm text-muted-foreground">Wir rechnen Ihr bisheriges Auto direkt auf dieses Angebot an.</p><Button asChild variant="silver" className="mt-4"><Link to="/auto-verkaufen" search={{ wunschfahrzeug: v.id }}>Preis anfragen →</Link></Button></section>

          <section id="anfrage" className="order-7 scroll-mt-28 rounded-lg border border-border bg-card p-5 md:p-8"><h2 className="section-h2">Anfrage zu diesem Fahrzeug</h2><p className="mt-2 text-sm text-muted-foreground">{v.title} · {formatPrice(v.price_eur)}</p><div className="mt-6"><VehicleInquiryForm vehicleId={v.id} vehicleTitle={v.title} kind={kind} onKindChange={setKind} /></div></section>

          <p className="order-8 text-xs leading-5 text-muted-foreground">Diese Seite dient der Information. Ein Kaufvertrag kommt ausschließlich vor Ort in unserem Autohaus oder nach individueller Absprache zustande. Eine verbindliche Reservierung ist über die Website nicht möglich.</p>
        </div>

        <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <div className="rounded-lg border border-border bg-card p-6">
             <h1 className="font-display text-2xl font-semibold leading-[1.15] text-foreground">{v.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">EZ {formatFirstRegistration(v.first_registration)} · {formatKm(v.mileage_km)} · {formatFuel(v.fuel)} · {formatTransmission(v.transmission)}{v.power_ps ? ` · ${v.power_ps} PS` : ""}</p>
             <p className="mt-6 font-display text-4xl font-bold text-foreground">{formatPrice(v.price_eur)}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{v.tax_status === "differenz" ? "Differenzbesteuert nach § 25a UStG, MwSt. nicht ausweisbar" : "inkl. 19 % MwSt., MwSt. ausweisbar"}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Finanzierung über Santander Consumer Bank oder DKB, Bonität vorausgesetzt.</p>
            {siteConfig.features.showMonthlyRate ? <p className="mt-3 text-sm text-foreground">Finanzierung auf Anfrage</p> : null}
            <div className="mt-6 grid gap-3">
               <Button variant="gold" onClick={() => goToForm("probefahrt")}>Probefahrt anfragen</Button>
               <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm"><button className="text-silver underline underline-offset-4 hover:text-gold" onClick={() => goToForm("anfrage")}>Anfrage senden</button><a className="text-silver underline underline-offset-4 hover:text-gold" href={phoneHref}>Anrufen</a><a className="text-silver underline underline-offset-4 hover:text-gold" href={vehicleWhatsappUrl(v.title, v.price_eur, pageUrl)} target="_blank" rel="noopener noreferrer">WhatsApp</a></div>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">{["Geprüft", "12 Monate Gewährleistung", "Inzahlungnahme möglich"].map((t) => <li key={t} className="flex items-center gap-1.5"><Check className="size-3.5 text-gold" />{t}</li>)}</ul>
          </div>
        </aside>
      </div>

      {similar.data?.length ? <section className="mt-20"><h2 className="section-h2">Ähnliche Fahrzeuge</h2><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{similar.data.map((s) => <VehicleCard key={s.id} vehicle={s} />)}</div></section> : null}
    </div>
  );
}
