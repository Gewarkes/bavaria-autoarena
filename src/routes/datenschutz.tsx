import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo, withTitle, dealerJsonLd } from "@/lib/seo";
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
export const Route = createFileRoute("/datenschutz")({ head: () => ({ ...withTitle(seo("x", 'Datenschutzerklärung nach Art. 13 DSGVO der Bavaria Autoarena GmbH: Formulare, Hosting, WhatsApp, Ihre Rechte.', "/datenschutz"), 'Datenschutzerklärung | Bavaria Autoarena Perkam') }), component: PrivacyPage });