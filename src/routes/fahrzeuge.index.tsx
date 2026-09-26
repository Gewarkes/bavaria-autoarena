import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
import { validateVehicleSearch } from "@/lib/vehicleSearch";
import { searchToFilter } from "@/lib/vehicleSearch";
import { brandsQuery, vehiclesQuery } from "@/lib/vehicles";

const VehiclesPage = lazy(() => import("@/pages/VehiclesPage"));
const title = "Fahrzeuge | Bavaria Autoarena Perkam";

export const Route = createFileRoute("/fahrzeuge/")({
  validateSearch: validateVehicleSearch,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(vehiclesQuery(searchToFilter(deps.search))),
      context.queryClient.ensureQueryData(vehiclesQuery({})),
      context.queryClient.ensureQueryData(brandsQuery()),
    ]);
  },
  head: () => {
    const base = seo("Fahrzeuge", "Geprüfte Gebrauchtwagen mit 12 Monaten Gewährleistung bei Bavaria Autoarena in Perkam bei Straubing. Jetzt Bestand filtern.", "/fahrzeuge");
    return { ...base, meta: base.meta.map((m) => ("title" in m ? { title } : m.property === "og:title" ? { property: "og:title", content: title } : m)) };
  },
  component: VehiclesPage,
});
