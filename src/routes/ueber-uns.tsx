import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo, withTitle, dealerJsonLd } from "@/lib/seo";
const AboutPage = lazy(() => import("@/pages/AboutPage"));
export const Route = createFileRoute("/ueber-uns")({ head: () => ({ ...withTitle(seo("x", 'Neu gebaut, fest verwurzelt in Niederbayern: Lernen Sie Bavaria Autoarena, unser Team und unser Prüfversprechen kennen.', "/ueber-uns"), 'Über uns – Ihr Autohaus in Perkam | Bavaria Autoarena') }), component: AboutPage });