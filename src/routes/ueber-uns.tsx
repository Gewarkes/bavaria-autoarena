import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
const AboutPage = lazy(() => import("@/pages/AboutPage"));
export const Route = createFileRoute("/ueber-uns")({ head: () => seo("Über uns", "Bavaria Autoarena und das neue Autohaus in Perkam bei Straubing kennenlernen.", "/ueber-uns"), component: AboutPage });