import { sizedImage } from "@/lib/vehicleImages";
import { Link } from "@tanstack/react-router";
import { formatFirstRegistration, formatFuel, formatKm, formatPrice, formatTransmission } from "@/lib/format";
import { VehicleImg } from "./VehicleImg";
import { Camera } from "lucide-react";
import { coverImage, type Vehicle } from "@/lib/vehicles";

export function VehicleCard({ vehicle, eager = false, onImageError }: { vehicle: Vehicle; eager?: boolean; onImageError?: (vehicle: Vehicle) => void }) {
  const image = coverImage(vehicle);
  const coverIndex = image ? vehicle.images.indexOf(image) : -1;
  const coverHasSeal = vehicle.seal_indices.includes(coverIndex);
  const isNew = !vehicle.is_demo && Date.now() - new Date(vehicle.created_at).getTime() < 14 * 86_400_000;
  const meta = `${formatFirstRegistration(vehicle.first_registration)} · ${formatKm(vehicle.mileage_km)} · ${formatFuel(vehicle.fuel)} · ${formatTransmission(vehicle.transmission)}`;

  return (
    <Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }} className="group flex h-full flex-col overflow-hidden rounded-sm bg-card ring-1 ring-foreground/5 transition-[box-shadow] hover:ring-primary">
      <div className="relative aspect-[4/3] overflow-hidden bg-image-placeholder">
        {image ? <VehicleImg src={sizedImage(image.thumbUrl || image.url, "card")} srcSet={`${sizedImage(image.url, "card")} 640w, ${sizedImage(image.url, "medium")} 1024w`} sizes="(min-width:1024px) 400px, (min-width:768px) 50vw, 100vw" alt={image.alt || vehicle.title} width="1024" height="768" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} onError={() => onImageError?.(vehicle)} className="size-full bg-image-placeholder object-cover object-center transition-transform duration-500 motion-safe:[@media(hover:hover)]:group-hover:scale-[1.03]" /> : <VehicleImg src={undefined} className="size-full" />}
        {vehicle.status === "reserviert" ? <span className="absolute left-3 top-3 rounded-sm bg-ink-800 px-2.5 py-1 text-xs font-semibold text-foreground">Reserviert</span> : isNew ? <span className="absolute left-3 top-3 rounded-sm bg-ink-900 px-2.5 py-1 text-xs font-semibold text-foreground">Neu eingetroffen</span> : null}
        {(vehicle.image_count ?? vehicle.images.length) > 1 ? <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-sm bg-ink-900/70 px-2.5 py-1 text-[11px] text-foreground"><Camera className="size-3.5" strokeWidth={1.5} />{`${vehicle.image_count ?? vehicle.images.length} Fotos`}</span> : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-6">
        <p className="font-display text-xs font-medium uppercase tracking-[.2em] text-muted-foreground">{vehicle.brand}</p>
        <h3 className="mt-1 truncate font-display text-xl font-normal text-foreground">{vehicle.title.replace(new RegExp(`^${vehicle.brand}\\s*`, "i"), "")}</h3>
        <p className="mt-2 text-sm tabular-nums text-muted-foreground lg:text-[15px]">{meta}</p>
        {coverHasSeal ? <p className="mt-2 min-h-6 text-sm text-primary">Historienbericht vorhanden</p> : <span className="mt-2 min-h-6" aria-hidden="true" />}
        <div className="mt-auto border-t border-border pt-4"><p className="font-display text-2xl font-medium tabular-nums text-foreground lg:text-[26px]">{formatPrice(vehicle.price_eur)}</p><p className="text-xs text-muted-foreground">{vehicle.tax_status === "differenz" ? "§ 25a UStG" : "MwSt. ausweisbar"}</p></div>
      </div>
    </Link>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm bg-card ring-1 ring-foreground/5" aria-hidden="true">
      <div className="aspect-[4/3] animate-pulse bg-image-placeholder" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
        <div className="h-8 animate-pulse rounded bg-muted/60 sm:h-16" />
        <div className="h-7 w-2/5 animate-pulse rounded bg-primary/20" />
      </div>
    </div>
  );
}
