import { useRouterState, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard, VehicleCardSkeleton } from "@/components/vehicles/VehicleCard";
import { siteConfig } from "@/config/site";
import { highlightsQuery } from "@/lib/vehicles";
import { channelLabel } from "@/lib/tradeIn";

export default function SellCarThanksPage() {
  const state = useRouterState({ select: (s) => s.location.state.tradeIn });
  const showVehicles = state?.intent === "inzahlung";
  const vehicles = useQuery({ ...highlightsQuery(3), enabled: showVehicles });
  const channel = state?.channel ? channelLabel[state.channel] : null;
  return (
    <div>
      <section className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-6">
        <CheckCircle2 className="mx-auto size-14 text-gold-700" />
        <h1 className="mt-6 display-title text-navy-900">{state?.firstName ? `Vielen Dank, ${state.firstName}!` : "Vielen Dank!"}</h1>
        <p className="mt-5 text-lg leading-8 text-ink-500">
          Wir prüfen Ihre Angaben und melden uns am nächsten Werktag{channel ? ` per ${channel}` : ""} mit einem unverbindlichen Angebot. Der endgültige Preis steht nach der Besichtigung fest.
        </p>
        <p className="mt-8 text-muted-foreground">Schneller geht es telefonisch:</p>
        <Button asChild variant="gold" className="mt-3"><a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}><Phone />{siteConfig.phone}</a></Button>
        <div className="mt-6"><Link to="/" className="text-sm text-gold-700 hover:underline">Zur Startseite</Link></div>
      </section>
      {showVehicles && (
        <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-6">
           <h2 className="section-h2">Passende Autos aus unserem Bestand</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.data ? vehicles.data.map((v) => <VehicleCard key={v.id} vehicle={v} />) : Array.from({ length: 3 }, (_, i) => <VehicleCardSkeleton key={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
