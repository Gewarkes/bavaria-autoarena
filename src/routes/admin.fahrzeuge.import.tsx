import { createFileRoute } from "@tanstack/react-router";
import AdminVehicleImportPage from "@/pages/admin/AdminVehicleImportPage";
export const Route = createFileRoute("/admin/fahrzeuge/import")({ component: AdminVehicleImportPage });
