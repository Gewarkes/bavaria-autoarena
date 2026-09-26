export function seo(title: string, description: string, path: string) {
  const fullTitle = `${title} | Bavaria Autoarena Perkam`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: path },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}
export function dealerJsonLd() {
  return {
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
  };
}

export function withTitle(base: ReturnType<typeof seo>, title: string) {
  return { ...base, meta: base.meta.map((m) => ("title" in m ? { title } : m.property === "og:title" ? { property: "og:title", content: title } : m)) };
}
