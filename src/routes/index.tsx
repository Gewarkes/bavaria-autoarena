import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";

const HomePage = lazy(() => import("@/pages/HomePage"));
export const Route = createFileRoute("/")({
  head: () => seo("Gebrauchtwagen & Fahrzeugankauf", "Bavaria Autoarena in Perkam bei Straubing: ausgewählte Gebrauchtwagen, Fahrzeugankauf und persönliche Beratung.", "/"),
  component: HomePage,
});
