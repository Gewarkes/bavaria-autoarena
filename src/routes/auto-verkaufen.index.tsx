import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
import { faqJsonLd } from "@/lib/tradeInFaq";

const SellCarPage = lazy(() => import("@/pages/SellCarPage"));
const title = "Auto verkaufen | Bavaria Autoarena Perkam";
const str = (v: unknown, max = 80) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined);
const uuid = (v: unknown) => (typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v) ? v : undefined);

export const Route = createFileRoute("/auto-verkaufen/")({
  validateSearch: (raw: Record<string, unknown>): { marke?: string | undefined; modell?: string | undefined; wunschfahrzeug?: string | undefined } => ({
    marke: str(raw["marke"], 60), modell: str(raw["modell"]), wunschfahrzeug: uuid(raw["wunschfahrzeug"]),
  }),
  head: () => {
    const base = seo("Auto verkaufen", "Auto in Perkam verkaufen oder in Zahlung geben. Kostenlose Anfrage und ein Angebot am nächsten Werktag.", "/auto-verkaufen");
    return {
      ...base,
      meta: base.meta.map((m) => ("title" in m ? { title } : m.property === "og:title" ? { property: "og:title", content: title } : m)),
      scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd()) }],
    };
  },
  component: SellCarPage,
});
