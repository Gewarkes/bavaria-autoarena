import { createFileRoute } from "@tanstack/react-router";
import AdminVehicleFormPage from "@/pages/admin/AdminVehicleFormPage";
export const Route = createFileRoute("/admin/fahrzeuge/neu")({ component: function C() { return <AdminVehicleFormPage />; } });
