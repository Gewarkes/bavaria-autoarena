import { createFileRoute } from "@tanstack/react-router";
import AdminTradeInDetailPage from "@/pages/admin/AdminTradeInDetailPage";
export const Route = createFileRoute("/admin/inzahlungnahme/$id")({ component: function C() { const { id } = Route.useParams(); return <AdminTradeInDetailPage id={id} />; } });
