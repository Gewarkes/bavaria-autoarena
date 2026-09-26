import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo, withTitle, dealerJsonLd } from "@/lib/seo";
const FinancingPage = lazy(() => import("@/pages/FinancingPage"));
export const Route = createFileRoute("/finanzierung")({ head: () => ({ ...withTitle(seo("x", 'Gebrauchtwagen flexibel finanzieren: Laufzeit 12–84 Monate, Anzahlung flexibel, Inzahlungnahme als Anzahlung. Jetzt unverbindlich anfragen.', "/finanzierung"), 'Finanzierung & Leasing für Gebrauchtwagen in Straubing | Bavaria Autoarena') }), component: FinancingPage });