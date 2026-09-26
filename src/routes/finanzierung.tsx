import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
const FinancingPage = lazy(() => import("@/pages/FinancingPage"));
export const Route = createFileRoute("/finanzierung")({ head: () => seo("Finanzierung", "Flexible Finanzierungsmöglichkeiten für Ihren Gebrauchtwagen bei Bavaria Autoarena.", "/finanzierung"), component: FinancingPage });