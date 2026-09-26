import { sizedImage } from "@/lib/vehicleImages";
import { Link } from "@tanstack/react-router";
import { formatFirstRegistration, formatFuel, formatKm, formatPrice, formatTransmission } from "@/lib/format";
import { VehicleImg } from "./VehicleImg";
import { Camera } from "lucide-react";
import { useState } from "react";
import { coverImage, type Vehicle } from "@/lib/vehicles";

export function VehicleCard({ vehicle, eager = false }: { vehicle: Vehicle; eager?: boolean }) {
  const [hoverReady, setHoverReady] = useState(false);
  const image = coverImage(vehicle);
  const coverIndex = vehicle.images.indexOf(image!);
  const hoverImage = vehicle.hover_index == null ? undefined : vehicle.images[vehicle.hover_index];
  const coverHasSeal = vehicle.seal_indices.includes(coverIndex);
  const isNew = !vehicle.is_demo && Date.now() - new Date(vehicle.created_at).getTime() < 14 * 86_400_000;
  const meta = `${formatFirstRegistration(vehicle.first_registration)} · ${formatKm(vehicle.mileage_km)} · ${formatFuel(vehicle.fuel)}`;

  return (
    <Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }} onPointerEnter={() => setHoverReady(true)} className="group block overflow-hidden rounded-sm bg-card ring-1 ring-navy-900/5 transition-[box-shadow] hover:ring-gold-500/50">
      <div className="relative aspect-video overflow-hidden bg-silver-200">
        {image ? <VehicleImg src={sizedImage(image.thumbUrl || image.url, "card")} srcSet={`${sizedImage(image.url, "card")} 640w, ${sizedImage(image.url, "medium")} 1024w`} sizes="(min-width:1280px) 400px, (min-width:768px) 50vw, 100vw" alt={image.alt || vehicle.title} width="1024" height="576" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} className={`size-full bg-silver-200 object-cover transition-transform duration-500 group-hover:scale-[1.03] ${coverHasSeal ? "origin-bottom scale-[1.06] object-[50%_100%]" : "object-[50%_60%]"}`} /> : null}
        {hoverReady && hoverImage ? <VehicleImg src={sizedImage(hoverImage.url, "card")} alt="" width="1024" height="576" loading="eager" className="pointer-events-none absolute inset-0 size-full object-cover object-[50%_60%] opacity-0 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-100 [@media(hover:none)]:hidden" /> : null}
        {vehicle.status === "reserviert" ? <span className="absolute left-3 top-3 rounded-sm bg-cream px-2.5 py-1 text-xs font-semibold text-navy-900">Reserviert</span> : isNew ? <span className="absolute left-3 top-3 rounded-sm bg-navy-900 px-2.5 py-1 text-xs font-semibold text-cream">Neu eingetroffen</span> : null}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-sm bg-navy-900/70 px-2.5 py-1 text-[11px] text-cream"><Camera className="size-3.5" strokeWidth={1.5} />{vehicle.image_count ?? vehicle.images.length} Fotos</span>
      </div>
      <div className="min-w-0 p-5">
        <p className="font-display text-xs font-medium uppercase tracking-[.2em] text-ink-500">{vehicle.brand}</p>
        <h3 className="mt-1 truncate font-display text-xl font-normal text-navy-900">{vehicle.title.replace(new RegExp(`^${vehicle.brand}\\s*`, "i"), "")}</h3>
        <p className="mt-2 truncate text-sm tabular-nums text-ink-500">{meta}<span className="hidden sm:inline"> · {formatTransmission(vehicle.transmission)}</span></p>
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-silver-300 pt-4"><div><p className="text-2xl font-semibold tabular-nums text-navy-900">{formatPrice(vehicle.price_eur)}</p><p className="text-[11px] text-ink-500">{vehicle.tax_status === "differenz" ? "§ 25a UStG" : "MwSt. ausweisbar"}</p></div><span className="text-sm font-semibold text-gold-700 underline decoration-gold-700/40 underline-offset-4">Details</span></div>
      </div>
    </Link>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm bg-card ring-1 ring-navy-900/5" aria-hidden="true">
      <div className="aspect-video animate-pulse bg-silver-200" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
        <div className="h-8 animate-pulse rounded bg-muted/60 sm:h-16" />
        <div className="h-7 w-2/5 animate-pulse rounded bg-gold/20" />
      </div>
    </div>
  );
}
