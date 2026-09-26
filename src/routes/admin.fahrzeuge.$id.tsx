import { createFileRoute } from "@tanstack/react-router";
import AdminVehicleFormPage from "@/pages/admin/AdminVehicleFormPage";
export const Route = createFileRoute("/admin/fahrzeuge/$id")({ component: function C() { const { id } = Route.useParams(); return <AdminVehicleFormPage key={id} id={id} />; } });
