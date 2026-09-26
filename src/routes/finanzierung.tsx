import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo, withTitle } from "@/lib/seo";
const FinancingPage = lazy(() => import("@/pages/FinancingPage"));
export const Route = createFileRoute("/finanzierung")({ head: () => withTitle(seo("x", "Finanzierung über Santander und DKB: 12 bis 84 Monate, mit oder ohne Anzahlung. Wir rechnen das gemeinsam im Autohaus durch.", "/finanzierung"), "Finanzierung | Bavaria Autoarena Perkam"), component: FinancingPage });