import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo, dealerJsonLd } from "@/lib/seo";

const HomePage = lazy(() => import("@/pages/HomePage"));
export const Route = createFileRoute("/")({
  head: () => {
    const base = seo("Gebrauchtwagen in Perkam bei Straubing", "Geprüfte Gebrauchtwagen, faire Inzahlungnahme und persönliche Beratung im neuen Autohaus in Perkam. 4,7 Sterne auf mobile.de.", "/");
    const exactTitle = "Gebrauchtwagen in Perkam bei Straubing | Bavaria Autoarena";
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
