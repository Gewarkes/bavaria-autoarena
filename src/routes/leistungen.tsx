import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo, withTitle } from "@/lib/seo";
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
export const Route = createFileRoute("/leistungen")({
  head: () => withTitle(seo("x", "Ankauf, Finanzierung mit Santander und DKB, Zulassung, Lieferservice, Export und Garantie – alles aus einer Hand in Perkam bei Straubing.", "/leistungen"), "Leistungen: Ankauf, Zulassung, Lieferung, Export | Bavaria Autoarena"),
  component: ServicesPage,
});
