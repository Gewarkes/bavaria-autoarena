import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auto-verkaufen")({ component: SellCarLayout });

function SellCarLayout() { return <Outlet />; }
