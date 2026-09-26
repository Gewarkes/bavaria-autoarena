import { Link } from "@tanstack/react-router";
import { CalendarDays, Fuel, Gauge, Settings2, Zap } from "lucide-react";
import { siteConfig } from "@/config/site";
import { formatFirstRegistration, formatFuel, formatKm, formatPrice, formatTransmission } from "@/lib/format";
import { VehicleImg } from "./VehicleImg";
import type { Vehicle } from "@/lib/vehicles";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const image = vehicle.images[0];
  const facts = [
    { icon: CalendarDays, label: `EZ ${formatFirstRegistration(vehicle.first_registration)}` },
    { icon: Gauge, label: formatKm(vehicle.mileage_km) },
    { icon: Fuel, label: formatFuel(vehicle.fuel) },
    { icon: Settings2, label: formatTransmission(vehicle.transmission) },
    ...(vehicle.power_ps ? [{ icon: Zap, label: `${vehicle.power_ps} PS` }] : []),
  ];

  return (
    <Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }} className="group block overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-gold">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {image ? <VehicleImg src={image.thumbUrl || image.url} alt={image.alt || vehicle.title} width="800" height="600" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : null}
        {vehicle.status === "reserviert" ? <span className="absolute left-3 top-3 rounded-md bg-warning px-2.5 py-1 text-xs font-bold text-primary-foreground">Reserviert</span> : vehicle.is_highlight ? <span className="bg-gold-gradient absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-bold text-primary-foreground">Highlight</span> : null}
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 min-h-12 font-display text-base font-bold uppercase tracking-wide text-foreground">{vehicle.title}</h3>
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-y border-border py-3 text-xs text-muted-foreground">
          {facts.map(({ icon: Icon, label }) => <span key={label} className="flex min-w-0 items-center gap-1.5"><Icon className="size-3.5 shrink-0 text-gold" /><span className="truncate">{label}</span></span>)}
        </div>
        <p className="text-gold-gradient mt-4 font-display text-2xl font-extrabold tracking-wide">{formatPrice(vehicle.price_eur)}</p>
        <p className="mt-1 text-[0.68rem] text-muted-foreground">{vehicle.tax_status === "differenz" ? "§ 25a differenzbesteuert" : "MwSt. ausweisbar"}</p>
        {siteConfig.features.showMonthlyRate ? <p className="mt-3 text-sm text-foreground">Finanzierung auf Anfrage</p> : null}
      </div>
    </Link>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card" aria-hidden="true">
      <div className="aspect-4/3 animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
        <div className="h-16 animate-pulse rounded bg-muted/60" />
        <div className="h-7 w-2/5 animate-pulse rounded bg-gold/20" />
      </div>
    </div>
  );
}
