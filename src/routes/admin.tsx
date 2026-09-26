import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { AdminShell } from "@/components/admin/AdminShell";
export const Route = createFileRoute("/admin")({ ssr: false, head: () => { const b = seo("Verwaltung", "Verwaltungsbereich der Bavaria Autoarena GmbH.", "/admin"); return { ...b, meta: [...b.meta, { name: "robots", content: "noindex, nofollow" }] }; }, component: AdminShell });
