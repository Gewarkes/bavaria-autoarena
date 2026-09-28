import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const HeroPreviewPage = lazy(() => import("@/pages/HeroPreviewPage"));

export const Route = createFileRoute("/hero-vorschau")({
  head: () => ({
    meta: [
      { title: "Titelbild-Auswahl | Bavaria Autoarena" },
      { name: "description", content: "Interne Auswahl der Titelbild-Varianten für Bavaria Autoarena." },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { property: "og:title", content: "Titelbild-Auswahl | Bavaria Autoarena" },
      { property: "og:description", content: "Interne Auswahl der Titelbild-Varianten für Bavaria Autoarena." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HeroPreviewPage,
});