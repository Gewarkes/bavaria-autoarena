import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo, withTitle, dealerJsonLd } from "@/lib/seo";
const ImprintPage = lazy(() => import("@/pages/ImprintPage"));
export const Route = createFileRoute("/impressum")({ head: () => ({ ...withTitle(seo("x", 'Impressum und Anbieterkennzeichnung nach § 5 DDG der Bavaria Autoarena GmbH, Perkam.', "/impressum"), 'Impressum | Bavaria Autoarena Perkam') }), component: ImprintPage });