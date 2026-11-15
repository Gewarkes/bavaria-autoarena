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
      <section className="page-container section-space">
        <div className="max-w-3xl">
        <p className="eyebrow flex items-center gap-2 text-primary"><CheckCircle2 className="size-4" strokeWidth={1.5} />Anfrage übermittelt</p>
        <h1 className="mt-5 display-title !max-w-none text-[40px] text-foreground lg:text-[64px]">{state?.firstName ? `Vielen Dank, ${state.firstName}!` : "Vielen Dank!"}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Wir prüfen Ihre Angaben und melden uns am nächsten Werktag{channel ? ` per ${channel}` : ""} mit einem unverbindlichen Angebot. Der endgültige Preis steht nach der Besichtigung fest.
        </p>
        <p className="mt-8 text-muted-foreground">Schneller geht es telefonisch:</p>
        <Button asChild variant="brand" className="mt-3"><a href={siteConfig.phoneHref}><Phone />{siteConfig.phone}</a></Button>
        <div className="mt-6"><Link to="/" className="text-link text-primary">Zur Startseite</Link></div>
        </div>
      </section>
      {showVehicles && (
        <section className="page-container border-t border-border section-space">
           <h2 className="section-h2">Passende Autos aus unserem Bestand</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-8">
            {vehicles.data ? vehicles.data.map((v) => <VehicleCard key={v.id} vehicle={v} />) : Array.from({ length: 3 }, (_, i) => <VehicleCardSkeleton key={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
