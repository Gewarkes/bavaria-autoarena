import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
const VehiclesPage = lazy(() => import("@/pages/VehiclesPage"));
export const Route = createFileRoute("/fahrzeuge/")({ head: () => seo("Fahrzeuge", "Ausgewählte Gebrauchtwagen bei Bavaria Autoarena in Perkam entdecken.", "/fahrzeuge"), component: VehiclesPage });