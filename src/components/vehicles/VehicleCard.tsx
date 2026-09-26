import { sizedImage } from "@/lib/vehicleImages";
import { Link } from "@tanstack/react-router";
import { formatFirstRegistration, formatFuel, formatKm, formatPrice, formatTransmission } from "@/lib/format";
import { VehicleImg } from "./VehicleImg";
import type { Vehicle } from "@/lib/vehicles";

export function VehicleCard({ vehicle, eager = false }: { vehicle: Vehicle; eager?: boolean }) {
  const image = vehicle.images[0];
  const firstFacts = `EZ ${formatFirstRegistration(vehicle.first_registration)} · ${formatKm(vehicle.mileage_km)}`;
  const secondFacts = `${formatFuel(vehicle.fuel)} · ${formatTransmission(vehicle.transmission)}`;

  return (
    <Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }} className="group grid min-h-[130px] grid-cols-[40%_minmax(0,1fr)] overflow-hidden rounded border border-border bg-card transition-colors hover:border-gold sm:block">
      <div className="relative min-h-full overflow-hidden bg-muted sm:aspect-4/3">
        {image ? <VehicleImg src={sizedImage(image.thumbUrl || image.url, "card")} alt={image.alt || vehicle.title} width="800" height="600" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} className="size-full bg-image-placeholder object-cover" /> : null}
        {vehicle.status === "reserviert" ? <span className="absolute left-3 top-3 rounded bg-background/95 px-2.5 py-1 text-xs font-medium text-foreground">Reserviert</span> : null}
      </div>
      <div className="min-w-0 p-3 sm:p-5">
        <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-5 text-foreground sm:text-lg">{vehicle.title}</h3>
        <div className="mt-2 text-[13px] leading-5 text-muted-foreground sm:text-sm"><p>{firstFacts}</p><p>{secondFacts}</p></div>
        <div className="mt-2 sm:mt-5 sm:flex sm:flex-wrap sm:items-baseline sm:gap-x-3 sm:gap-y-1"><p className="font-display text-xl font-bold text-foreground sm:text-2xl">{formatPrice(vehicle.price_eur)}</p><p className="text-[11px] text-muted-foreground sm:text-xs">{vehicle.tax_status === "differenz" ? "§ 25a" : "MwSt. ausweisbar"}</p></div>
      </div>
    </Link>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="grid min-h-[130px] grid-cols-[40%_minmax(0,1fr)] overflow-hidden rounded border border-border bg-card sm:block" aria-hidden="true">
      <div className="min-h-full animate-pulse bg-muted sm:aspect-4/3" />
      <div className="space-y-3 p-3 sm:p-5">
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
        <div className="h-8 animate-pulse rounded bg-muted/60 sm:h-16" />
        <div className="h-7 w-2/5 animate-pulse rounded bg-gold/20" />
      </div>
    </div>
  );
}
