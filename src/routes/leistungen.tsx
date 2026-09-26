import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo, withTitle } from "@/lib/seo";
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
export const Route = createFileRoute("/leistungen")({
  head: () => withTitle(seo("x", "Ankauf, Finanzierung, Zulassung, Lieferung, Export und Gewährleistung direkt über unser Autohaus in Perkam.", "/leistungen"), "Leistungen | Bavaria Autoarena Perkam"),
  component: ServicesPage,
});
