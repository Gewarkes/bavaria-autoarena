import { createFileRoute } from "@tanstack/react-router";
import AdminInquiriesPage from "@/pages/admin/AdminInquiriesPage";
export const Route = createFileRoute("/admin/anfragen")({ validateSearch: (s: Record<string, unknown>): { id?: string | undefined } => (typeof s['id'] === "string" ? { id: s['id'] } : {}), component: function C() { const { id } = Route.useSearch(); return <AdminInquiriesPage selectedId={id} />; } });
