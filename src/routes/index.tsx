import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo, dealerJsonLd } from "@/lib/seo";

const HomePage = lazy(() => import("@/pages/HomePage"));
export const Route = createFileRoute("/")({
  head: () => {
    const base = seo("Gebrauchtwagen in Perkam bei Straubing", "Gebrauchtwagen vom Alltagsauto bis zum Sportwagen in Perkam. Vor Ort ansehen, Probe fahren und das eigene Auto in Zahlung geben.", "/");
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
