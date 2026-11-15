import { sizedImage } from "@/lib/vehicleImages";
import { Link } from "@tanstack/react-router";
import { formatFirstRegistration, formatFuel, formatKm, formatPrice, formatTransmission } from "@/lib/format";
import { VehicleImg } from "./VehicleImg";
import { ArrowRight, Camera, Cog, Fuel, Gauge, Zap } from "lucide-react";
import { coverImage, type Vehicle } from "@/lib/vehicles";

export function VehicleCard({ vehicle, eager = false, onImageError }: { vehicle: Vehicle; eager?: boolean; onImageError?: (vehicle: Vehicle) => void }) {
  const image = coverImage(vehicle);
  const coverIndex = image ? vehicle.images.indexOf(image) : -1;
  const coverHasSeal = vehicle.seal_indices.includes(coverIndex);
  const isNew = !vehicle.is_demo && Date.now() - new Date(vehicle.created_at).getTime() < 14 * 86_400_000;
  const kicker = [vehicle.brand, `EZ ${formatFirstRegistration(vehicle.first_registration)}`, formatKm(vehicle.mileage_km)].join(" · ");
  const specs = [{ icon: Fuel, text: formatFuel(vehicle.fuel) }, { icon: Cog, text: formatTransmission(vehicle.transmission) }, { icon: Zap, text: vehicle.power_ps ? `${vehicle.power_ps} PS` : "–" }, { icon: Gauge, text: formatKm(vehicle.mileage_km) }];

  return (
    <Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }} className="group relative flex h-full flex-col overflow-hidden rounded-sm bg-card ring-1 ring-border transition-[box-shadow,background-color] duration-300 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <div className="relative aspect-[4/3] overflow-hidden bg-image-placeholder">
        {image ? <VehicleImg src={sizedImage(image.thumbUrl || image.url, "card")} srcSet={`${sizedImage(image.url, "card")} 640w, ${sizedImage(image.url, "medium")} 1024w`} sizes="(min-width:1024px) 400px, (min-width:768px) 50vw, 100vw" alt={image.alt || vehicle.title} width="1024" height="768" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} onError={() => onImageError?.(vehicle)} className="size-full bg-image-placeholder object-cover object-center transition-transform duration-500 motion-safe:[@media(hover:hover)]:group-hover:scale-[1.03]" /> : <VehicleImg src={undefined} className="size-full" />}
        {vehicle.status === "reserviert" ? <span className="absolute left-3 top-3 rounded-sm bg-ink-800 px-2.5 py-1 text-xs font-semibold text-foreground">Reserviert</span> : isNew ? <span className="absolute left-3 top-3 rounded-sm bg-ink-900 px-2.5 py-1 text-xs font-semibold text-foreground">Neu eingetroffen</span> : null}
        {(vehicle.image_count ?? vehicle.images.length) > 1 ? <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-sm bg-ink-900/70 px-2.5 py-1 text-[11px] text-foreground"><Camera className="size-3.5" strokeWidth={1.5} />{`${vehicle.image_count ?? vehicle.images.length} Fotos`}</span> : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-6">
        <p className="truncate font-display text-[11px] font-medium uppercase tracking-[.15em] text-subtle">{kicker}</p>
        <h3 className="mt-2 truncate font-display text-2xl font-light text-foreground">{vehicle.title.replace(new RegExp(`^${vehicle.brand}\\s*`, "i"), "")}</h3>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[15px] tabular-nums text-muted-foreground">{specs.map(({ icon: Icon, text }, i) => <li key={i} className="flex min-w-0 items-center gap-2"><Icon aria-hidden="true" className="size-4 shrink-0 text-subtle" strokeWidth={1.5} /><span className="truncate">{text}</span></li>)}</ul>
        {coverHasSeal ? <p className="mt-3 min-h-6 text-sm text-primary">Historienbericht vorhanden</p> : <span className="mt-3 min-h-6" aria-hidden="true" />}
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-border pt-5"><div><p className="font-display text-[26px] font-semibold leading-none tabular-nums text-foreground lg:text-[28px]">{formatPrice(vehicle.price_eur)}</p><p className="mt-1.5 text-xs text-muted-foreground">{vehicle.tax_status === "differenz" ? "Endpreis · § 25a UStG" : "Endpreis · MwSt. ausweisbar"}</p></div><ArrowRight aria-label="Ansehen" className="size-5 text-subtle transition-[color,transform] duration-200 group-hover:translate-x-1 group-hover:text-primary" strokeWidth={1.5} /></div><span aria-hidden="true" className="brand-line absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
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
