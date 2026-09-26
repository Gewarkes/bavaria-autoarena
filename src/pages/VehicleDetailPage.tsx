import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Car, Check, ChevronRight, Fuel, Gauge, MessageCircle, Palette, Phone, Settings2, ShieldCheck, Users, Zap } from "lucide-react";
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
    : isNew ? <span className="bg-gold-gradient rounded-md px-3 py-1 text-xs font-bold text-primary-foreground">Neu eingetroffen</span> : null;
  const goToForm = (k: Kind) => { setKind(k); document.getElementById("anfrage")?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  const facts = [
    { icon: CalendarDays, label: "Erstzulassung", value: formatFirstRegistration(v.first_registration) },
    { icon: Gauge, label: "Kilometer", value: formatKm(v.mileage_km) },
    { icon: Fuel, label: "Kraftstoff", value: formatFuel(v.fuel) },
    { icon: Settings2, label: "Getriebe", value: formatTransmission(v.transmission) },
    ...(v.power_ps || v.power_kw ? [{ icon: Zap, label: "Leistung", value: `${v.power_ps ?? "–"} PS / ${v.power_kw ?? "–"} kW` }] : []),
    { icon: Car, label: "Karosserie", value: v.body_type },
    ...(v.color ? [{ icon: Palette, label: "Farbe", value: v.color }] : []),
    ...(v.hu_until ? [{ icon: ShieldCheck, label: "HU", value: v.hu_until }] : []),
    ...(v.previous_owners != null ? [{ icon: Users, label: "Vorbesitzer", value: String(v.previous_owners) }] : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-6">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-gold">Start</Link><ChevronRight className="size-3.5" />
        <Link to="/fahrzeuge" className="hover:text-gold">Fahrzeuge</Link><ChevronRight className="size-3.5" />
        <span className="truncate text-foreground" aria-current="page">{v.title}</span>
      </nav>
      <Link to="/fahrzeuge" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light"><ArrowLeft className="size-4" />Zurück zur Übersicht</Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-10">
          <VehicleGallery images={v.images} title={v.title} badge={badge} />

          <section><h2 className="section-h2">Kerndaten</h2><dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">{facts.map(({ icon: Icon, label, value }) => <div key={label} className="bg-card p-4"><dt className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground"><Icon className="size-4 text-gold" />{label}</dt><dd className="mt-1 font-semibold text-foreground">{value}</dd></div>)}</dl></section>

          {v.features.length ? <section><h2 className="section-h2">Ausstattung</h2><ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">{v.features.map((f) => <li key={f} className="flex items-center gap-3 text-foreground"><span className="grid size-6 shrink-0 place-items-center rounded-full border border-gold/50 text-gold"><Check className="size-3.5" /></span>{f}</li>)}</ul></section> : null}

          {v.description ? <section><h2 className="section-h2">Beschreibung</h2><p className="mt-5 max-w-3xl whitespace-pre-line leading-7 text-muted-foreground">{v.description}</p></section> : null}

          <section className="flex flex-col gap-4 rounded-lg border border-gold/50 bg-card p-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">Ihr Auto in Zahlung geben?</h2><p className="mt-1 text-sm text-muted-foreground">Wir rechnen Ihr Altfahrzeug direkt auf dieses Fahrzeug an.</p></div><Button asChild variant="silver"><Link to="/auto-verkaufen" search={{ wunschfahrzeug: v.id }}>Fahrzeug bewerten lassen</Link></Button></section>

          <section id="anfrage" className="scroll-mt-28 rounded-lg border border-border bg-card p-6 md:p-8"><h2 className="section-h2">Anfrage zu diesem Fahrzeug</h2><p className="mt-2 text-sm text-muted-foreground">{v.title} · {formatPrice(v.price_eur)}</p><div className="mt-6"><VehicleInquiryForm vehicleId={v.id} vehicleTitle={v.title} kind={kind} onKindChange={setKind} /></div></section>

          <p className="text-xs leading-5 text-muted-foreground">Diese Seite dient der Information. Ein Kaufvertrag kommt ausschließlich vor Ort in unserem Autohaus oder nach individueller Absprache zustande. Eine verbindliche Reservierung ist über die Website nicht möglich.</p>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-lg border border-border bg-card p-6">
            <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-foreground">{v.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">EZ {formatFirstRegistration(v.first_registration)} · {formatKm(v.mileage_km)} · {formatFuel(v.fuel)} · {formatTransmission(v.transmission)}{v.power_ps ? ` · ${v.power_ps} PS` : ""}</p>
            <p className="text-gold-gradient mt-6 font-display text-4xl font-extrabold tracking-wide">{formatPrice(v.price_eur)}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{v.tax_status === "differenz" ? "Differenzbesteuert nach § 25a UStG, MwSt. nicht ausweisbar" : "inkl. 19 % MwSt., MwSt. ausweisbar"}</p>
            {siteConfig.features.showMonthlyRate ? <p className="mt-3 text-sm text-foreground">Finanzierung auf Anfrage</p> : null}
            <div className="mt-6 grid gap-3">
              <Button variant="gold" onClick={() => goToForm("probefahrt")}>Probefahrt vereinbaren</Button>
              <Button variant="silver" onClick={() => goToForm("anfrage")}>Anfrage senden</Button>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="ghost"><a href={phoneHref}><Phone />Anrufen</a></Button>
                <Button asChild variant="ghost"><a href={vehicleWhatsappUrl(v.title, v.price_eur, pageUrl)} target="_blank" rel="noopener noreferrer"><MessageCircle />WhatsApp</a></Button>
              </div>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">{["Geprüft", "12 Monate Gewährleistung", "Inzahlungnahme möglich"].map((t) => <li key={t} className="flex items-center gap-1.5"><Check className="size-3.5 text-gold" />{t}</li>)}</ul>
          </div>
        </aside>
      </div>

      {similar.data?.length ? <section className="mt-20"><h2 className="section-h2">Ähnliche Fahrzeuge</h2><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{similar.data.map((s) => <VehicleCard key={s.id} vehicle={s} />)}</div></section> : null}
    </div>
  );
}
