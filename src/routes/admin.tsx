import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { seo } from "@/lib/seo";
const AdminPage = lazy(() => import("@/pages/AdminPage"));
export const Route = createFileRoute("/admin")({ head: () => { const b = seo("Verwaltung", "Verwaltungsbereich der Bavaria Autoarena GmbH.", "/admin"); return { ...b, meta: [...b.meta, { name: "robots", content: "noindex, nofollow" }] }; }, component: AdminPage });