import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
const VehicleDetailPage = lazy(() => import("@/pages/VehicleDetailPage"));
export const Route = createFileRoute("/fahrzeuge/$slug")({ head: ({ params }) => seo("Fahrzeugdetails", "Details, Ausstattung und Kontakt zu diesem Fahrzeug bei Bavaria Autoarena.", `/fahrzeuge/${params.slug}`), component: VehicleDetailPage });