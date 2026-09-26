import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
const ContactPage = lazy(() => import("@/pages/ContactPage"));
export const Route = createFileRoute("/kontakt")({ head: () => seo("Kontakt", "Kontakt, Öffnungszeiten und Anfahrt zu Bavaria Autoarena in Perkam.", "/kontakt"), component: ContactPage });