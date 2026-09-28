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
    name: siteConfig.name,
    address: { "@type": "PostalAddress", streetAddress: siteConfig.street, postalCode: siteConfig.zip, addressLocality: siteConfig.city, addressCountry: "DE" },
    telephone: siteConfig.phoneInternational,
    sameAs: [siteConfig.mobileDeUrl, siteConfig.reviewsUrl, siteConfig.social.facebook, siteConfig.social.tiktok],
  };
}

export function withTitle(base: ReturnType<typeof seo>, title: string) {
  return { ...base, meta: base.meta.map((m) => ("title" in m ? { title } : "property" in m && m.property === "og:title" ? { property: "og:title", content: title } : m)) };
}
