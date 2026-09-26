import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
const ImprintPage = lazy(() => import("@/pages/ImprintPage"));
export const Route = createFileRoute("/impressum")({ head: () => seo("Impressum", "Anbieterkennzeichnung der Bavaria Autoarena GmbH in Perkam.", "/impressum"), component: ImprintPage });