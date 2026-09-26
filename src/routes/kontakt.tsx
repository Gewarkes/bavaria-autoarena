import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo, withTitle, dealerJsonLd } from "@/lib/seo";
const ContactPage = lazy(() => import("@/pages/ContactPage"));
export const Route = createFileRoute("/kontakt")({ head: () => ({ ...withTitle(seo("x", 'Adresse, Öffnungszeiten und Anfahrt zu Bavaria Autoarena in Perkam bei Straubing. Termin, Probefahrt oder Frage – wir melden uns schnell.', "/kontakt"), 'Kontakt & Anfahrt – Autohaus in Perkam | Bavaria Autoarena'), scripts: [{ type: "application/ld+json", children: JSON.stringify(dealerJsonLd()) }] }), component: ContactPage });