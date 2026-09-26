import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
import { validateVehicleSearch } from "@/lib/vehicleSearch";

const VehiclesPage = lazy(() => import("@/pages/VehiclesPage"));
const title = "Fahrzeuge | Bavaria Autoarena Perkam";

export const Route = createFileRoute("/fahrzeuge/")({
  validateSearch: validateVehicleSearch,
  head: () => {
    const base = seo("Fahrzeuge", "Geprüfte Gebrauchtwagen mit 12 Monaten Gewährleistung bei Bavaria Autoarena in Perkam bei Straubing. Jetzt Bestand filtern.", "/fahrzeuge");
    return { ...base, meta: base.meta.map((m) => ("title" in m ? { title } : m.property === "og:title" ? { property: "og:title", content: title } : m)) };
  },
  component: VehiclesPage,
});
