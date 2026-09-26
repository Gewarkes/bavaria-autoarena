import { createFileRoute } from "@tanstack/react-router";
import AdminVehiclesPage from "@/pages/admin/AdminVehiclesPage";
export const Route = createFileRoute("/admin/fahrzeuge/")({ component: AdminVehiclesPage });
