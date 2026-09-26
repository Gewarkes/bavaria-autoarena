import { sizedImage } from "@/lib/vehicleImages";
import { Link } from "@tanstack/react-router";
import { formatFirstRegistration, formatFuel, formatKm, formatPrice, formatTransmission } from "@/lib/format";
import { VehicleImg } from "./VehicleImg";
import type { Vehicle } from "@/lib/vehicles";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const image = vehicle.images[0];
  const facts = `EZ ${formatFirstRegistration(vehicle.first_registration)} · ${formatKm(vehicle.mileage_km)} · ${formatFuel(vehicle.fuel)} · ${formatTransmission(vehicle.transmission)}`;

  return (
    <Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }} className="group block overflow-hidden rounded border border-border bg-card transition-colors hover:border-gold">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {image ? <VehicleImg src={sizedImage(image.thumbUrl || image.url, "card")} alt={image.alt || vehicle.title} width="800" height="600" loading="lazy" className="size-full object-cover" /> : null}
        {vehicle.status === "reserviert" ? <span className="absolute left-3 top-3 rounded bg-background/95 px-2.5 py-1 text-xs font-medium text-foreground">Reserviert</span> : null}
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 font-display text-lg font-semibold text-foreground">{vehicle.title}</h3>
        <p className="mt-2 truncate text-sm text-muted-foreground">{facts}</p>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1"><p className="font-display text-2xl font-bold text-foreground">{formatPrice(vehicle.price_eur)}</p><p className="text-xs text-muted-foreground">{vehicle.tax_status === "differenz" ? "§ 25a" : "MwSt. ausweisbar"}</p></div>
      </div>
    </Link>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded border border-border bg-card" aria-hidden="true">
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
