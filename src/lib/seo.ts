import { siteConfig } from "@/config/site";

export const absUrl = (path: string) => (siteConfig.siteUrl ? `${siteConfig.siteUrl}${path}` : path);
/** og:image nur mit absoluter Domain – relative URLs werden von Crawlern ignoriert. */
export const ogImageMeta = (url?: string) => {
  const abs = url && /^https?:\/\//.test(url) ? url : siteConfig.siteUrl ? `${siteConfig.siteUrl}${url ?? "/og-default.jpg"}` : null;
  return abs ? [{ property: "og:image", content: abs }, { property: "og:image:width", content: "1200" }, { property: "og:image:height", content: "630" }, { name: "twitter:image", content: abs }] : [];
};

export function seo(title: string, description: string, path: string) {
  const fullTitle = `${title} | Bavaria Autoarena`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absUrl(path) },
      { property: "og:locale", content: "de_DE" },
      { property: "og:site_name", content: "Bavaria Autoarena" },
      ...ogImageMeta(),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absUrl(path) }],
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
  return { ...base, meta: base.meta.map((m) => ("title" in m ? { title } : "property" in m && m.property === "og:title" ? { property: "og:title", content: title } : m)) };
}
