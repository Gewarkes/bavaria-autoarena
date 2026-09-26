import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo, withTitle } from "@/lib/seo";
const AboutPage = lazy(() => import("@/pages/AboutPage"));
export const Route = createFileRoute("/ueber-uns")({ head: () => withTitle(seo("x", "Die Bavaria Autoarena in Perkam: inhabergeführt, mit selbst eingekauften und geprüften Gebrauchtwagen.", "/ueber-uns"), "Über uns | Bavaria Autoarena Perkam"), component: AboutPage });