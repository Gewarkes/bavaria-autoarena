import { Link } from "@tanstack/react-router";
import { CalendarDays, Fuel, Gauge, Settings2, Zap } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Vehicle } from "@/data/demoVehicles";

const priceFormatter = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const numberFormatter = new Intl.NumberFormat("de-DE");

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const image = vehicle.images[0];
  if (!image) return null;
  const facts = [
    { icon: CalendarDays, label: vehicle.firstRegistration },
    { icon: Gauge, label: `${numberFormatter.format(vehicle.mileageKm)} km` },
    { icon: Fuel, label: vehicle.fuel },
    { icon: Settings2, label: vehicle.transmission },
    { icon: Zap, label: `${vehicle.powerPs} PS` },
  ];

  return (
    <Link to="/fahrzeuge/$slug" params={{ slug: vehicle.slug }} className="group block overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-gold">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <img src={image} alt={vehicle.title} width="800" height="600" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        {vehicle.status === "reserviert" ? <span className="absolute left-3 top-3 rounded-md bg-warning px-2.5 py-1 text-xs font-bold text-primary-foreground">Reserviert</span> : vehicle.isHighlight ? <span className="bg-gold-gradient absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-bold text-primary-foreground">Highlight</span> : null}
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 min-h-12 font-display text-base font-bold uppercase tracking-wide text-foreground">{vehicle.title}</h3>
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-y border-border py-3 text-xs text-muted-foreground">
          {facts.map(({ icon: Icon, label }) => <span key={label} className="flex min-w-0 items-center gap-1.5"><Icon className="size-3.5 shrink-0 text-gold" /><span className="truncate">{label}</span></span>)}
        </div>
        <p className="text-gold-gradient mt-4 font-display text-2xl font-extrabold tracking-wide">{priceFormatter.format(vehicle.priceEur)}</p>
        <p className="mt-1 text-[0.68rem] text-muted-foreground">{vehicle.taxStatus === "differenz" ? "§ 25a differenzbesteuert" : "MwSt. ausweisbar"}</p>
        {siteConfig.features.showMonthlyRate ? <p className="mt-3 text-sm text-foreground">Finanzierung auf Anfrage</p> : null}
      </div>
    </Link>
  );
}