import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
const SellCarPage = lazy(() => import("@/pages/SellCarPage"));
export const Route = createFileRoute("/auto-verkaufen/")({ head: () => seo("Auto verkaufen", "Fahrzeug unverbindlich bewerten lassen und direkt an Bavaria Autoarena verkaufen.", "/auto-verkaufen"), component: SellCarPage });