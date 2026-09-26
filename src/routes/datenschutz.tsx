import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
export const Route = createFileRoute("/datenschutz")({ head: () => seo("Datenschutz", "Datenschutzhinweise der Bavaria Autoarena GmbH.", "/datenschutz"), component: PrivacyPage });