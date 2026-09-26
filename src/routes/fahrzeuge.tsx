import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fahrzeuge")({ component: VehiclesLayout });

function VehiclesLayout() { return <Outlet />; }
