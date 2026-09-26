import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
const SellCarThanksPage = lazy(() => import("@/pages/SellCarThanksPage"));
export const Route = createFileRoute("/auto-verkaufen/danke")({ head: () => seo("Vielen Dank", "Ihre Anfrage wurde an Bavaria Autoarena übermittelt.", "/auto-verkaufen/danke"), component: SellCarThanksPage });