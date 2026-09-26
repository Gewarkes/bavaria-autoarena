import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { lazy } from "react";
import { formatFirstRegistration, formatFuel, formatKm, formatPrice, formatTransmission } from "@/lib/format";
import { coverImage, publicGallery, vehicleQuery } from "@/lib/vehicles";
import { absUrl, ogImageMeta } from "@/lib/seo";
import { sizedImage } from "@/lib/vehicleImages";

const VehicleDetailPage = lazy(() => import("@/pages/VehicleDetailPage"));
const fuelSchema: Record<string, string> = { benzin: "Gasoline", diesel: "Diesel", hybrid: "Hybrid", elektro: "Electric", gas: "LPG" };

export const Route = createFileRoute("/fahrzeuge/$slug")({
  loader: async ({ params, context }) => {
    const vehicle = await context.queryClient.ensureQueryData(vehicleQuery(params.slug));
    if (!vehicle || vehicle.status === "verkauft") throw notFound();
    return { vehicle };
  },
  head: ({ loaderData, params }) => {
    const v = loaderData?.vehicle;
    if (!v) return { meta: [{ title: "Fahrzeug nicht gefunden | Bavaria Autoarena" }, { name: "robots", content: "noindex" }] };
    const full = `${v.title} – ${formatPrice(v.price_eur)} | Bavaria Autoarena`;
    const title = full.length <= 60 ? full : `${v.title.slice(0, 60 - 22 - formatPrice(v.price_eur).length).trim()}… – ${formatPrice(v.price_eur)}`;
    const rawDesc = `${v.title}: EZ ${formatFirstRegistration(v.first_registration)}, ${formatKm(v.mileage_km)}, ${formatFuel(v.fuel)}, ${formatTransmission(v.transmission)}${v.power_ps ? `, ${v.power_ps} PS` : ""}. Jetzt Probefahrt in Perkam bei Straubing vereinbaren.`;
    const description = rawDesc.length <= 155 ? rawDesc : `${rawDesc.slice(0, 152).trimEnd()}…`;
    const first = coverImage(v)?.url;
    const coverIndex = v.cover_index ?? 0;
    const image = first && /^https?:/.test(first) && !v.seal_indices.includes(coverIndex) ? sizedImage(first, "medium") : undefined;
    const path = `/fahrzeuge/${params.slug}`;
    return {
      meta: [
        { title }, { name: "description", content: description },
        { property: "og:title", content: title }, { property: "og:description", content: description },
        { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" },
        { property: "og:locale", content: "de_DE" }, { property: "og:url", content: absUrl(path) },
        ...ogImageMeta(image),
      ],
      links: [{ rel: "canonical", href: absUrl(path) }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org", "@type": "Car", name: v.title, brand: { "@type": "Brand", name: v.brand }, model: v.model,
          image: publicGallery(v).map((i) => i.url).filter((u) => /^https?:/.test(u)), bodyType: v.body_type, vehicleModelDate: v.first_registration.slice(0, 4),
          mileageFromOdometer: { "@type": "QuantitativeValue", value: v.mileage_km, unitCode: "KMT" },
          fuelType: fuelSchema[v.fuel] ?? v.fuel, vehicleTransmission: v.transmission === "automatik" ? "AutomaticTransmission" : "ManualTransmission",
          ...(v.color ? { color: v.color } : {}),
          offers: { "@type": "Offer", price: v.price_eur, priceCurrency: "EUR", itemCondition: "https://schema.org/UsedCondition",
            availability: v.status === "reserviert" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
            seller: { "@type": "AutoDealer", name: "Bavaria Autoarena GmbH" } },
        }) },
        { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Start", item: "/" },
            { "@type": "ListItem", position: 2, name: "Fahrzeuge", item: "/fahrzeuge" },
            { "@type": "ListItem", position: 3, name: v.title, item: path },
          ] }) },
      ],
    };
  },
  notFoundComponent: VehicleNotFound,
  errorComponent: VehicleError,
  component: VehicleDetailPage,
});

function VehicleNotFound() {
  return <div className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-foreground">Fahrzeug nicht gefunden</h1><p className="mt-4 text-muted-foreground">Dieses Fahrzeug ist nicht mehr verfügbar oder wurde bereits verkauft.</p><Link to="/fahrzeuge" className="mt-8 inline-block font-semibold text-gold hover:text-gold-light">Zum aktuellen Bestand →</Link></div>;
}

function VehicleError() {
  return <div className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-foreground">Fahrzeug konnte nicht geladen werden</h1><p className="mt-4 text-muted-foreground">Bitte versuchen Sie es später erneut.</p><Link to="/fahrzeuge" className="mt-8 inline-block font-semibold text-gold hover:text-gold-light">Zum Bestand →</Link></div>;
}
