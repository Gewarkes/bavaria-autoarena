import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo, dealerJsonLd } from "@/lib/seo";
import { vehiclesQuery } from "@/lib/vehicles";

const HomePage = lazy(() => import("@/pages/HomePage"));
export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(vehiclesQuery({}));
  },
  head: () => {
    const base = seo("Gebrauchtwagen in Perkam bei Straubing", "Ausgesuchte Gebrauchtwagen mit Finanzierung, Inzahlungnahme und Zulassung aus einer Hand. Bavaria Autoarena in Perkam bei Straubing.", "/");
    const exactTitle = "Bavaria Autoarena – Gebrauchtwagen in Perkam bei Straubing";
    return {
      ...base,
      meta: base.meta.map((entry) => "title" in entry ? { title: exactTitle } : entry.property === "og:title" ? { property: "og:title", content: exactTitle } : entry),
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify(dealerJsonLd()),
      }],
    };
  },
  component: HomePage,
});
