import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
export const Route = createFileRoute("/admin_/login")({ ssr: false, head: () => { const b = seo("Verwaltung", "Verwaltungsbereich der Bavaria Autoarena GmbH.", "/admin"); return { ...b, meta: [...b.meta, { name: "robots", content: "noindex, nofollow" }] }; }, component: AdminLoginPage });
