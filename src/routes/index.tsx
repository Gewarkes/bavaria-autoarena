import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";

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
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AutoDealer",
          name: "Bavaria Autoarena GmbH",
          address: { "@type": "PostalAddress", streetAddress: "Gewerbestraße 7", postalCode: "94368", addressLocality: "Perkam", addressCountry: "DE" },
          telephone: "+49 9421 000000",
          sameAs: ["https://home.mobile.de/BAVARIAAUTOARENASTRAUBINGGMBH"],
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "13:00" },
          ],
        }),
      }],
    };
  },
  component: HomePage,
});
