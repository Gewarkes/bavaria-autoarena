import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { listAdminVehicles, listInquiries, listTradeIns, fmtDateTime, KIND_LABEL } from "@/lib/admin";
import { ErrorBox, LeadBadge, PageTitle, TableSkeleton } from "@/components/admin/common";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const trade = useQuery({ queryKey: ["admin", "tradeins"], queryFn: listTradeIns });
  const inq = useQuery({ queryKey: ["admin", "inquiries"], queryFn: listInquiries });
  const veh = useQuery({ queryKey: ["admin", "vehicles"], queryFn: listAdminVehicles });
  const loading = trade.isLoading || inq.isLoading || veh.isLoading;
  const err = trade.error || inq.error || veh.error;

  const weekStart = new Date(); weekStart.setHours(0, 0, 0, 0); weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const t = trade.data ?? [], q = inq.data ?? [], v = veh.data ?? [];
  const kpis = [
    { label: "Neue Inzahlungnahme-Anfragen", value: t.filter((r) => r.status === "neu").length, to: "/admin/inzahlungnahme" as const },
    { label: "Neue Fahrzeuganfragen", value: q.filter((r) => r.status === "neu").length, to: "/admin/anfragen" as const },
    { label: "Anfragen diese Woche", value: [...t, ...q].filter((r) => new Date(r.created_at) >= weekStart).length, to: "/admin/anfragen" as const },
    { label: "Fahrzeuge verfügbar / reserviert", value: `${v.filter((r) => r.status === "verfuegbar").length} / ${v.filter((r) => r.status === "reserviert").length}`, to: "/admin/fahrzeuge" as const },
  ];
  const latest = [
    ...t.map((r) => ({ id: r.id, at: r.created_at, type: "Inzahlungnahme", name: `${r.first_name} ${r.last_name}`, info: `${r.brand} ${r.model}`, status: r.status, trade: true })),
    ...q.map((r) => ({ id: r.id, at: r.created_at, type: KIND_LABEL[r.kind] ?? r.kind, name: r.name, info: r.vehicles?.title ?? "–", status: r.status, trade: false })),
  ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 5);

  return (
    <div>
      <PageTitle title="Übersicht" />
      {err ? <ErrorBox error={err} /> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Link key={k.label} to={k.to} className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</p>
            {loading ? <Skeleton className="mt-3 h-9 w-20" /> : <p className="text-primary-gradient mt-2 font-display text-3xl font-extrabold">{k.value}</p>}
          </Link>
        ))}
      </div>
      <h2 className="mb-3 mt-10 font-display text-sm font-bold uppercase tracking-wide">Neueste Anfragen</h2>
      {loading ? <TableSkeleton rows={5} /> : (
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {latest.length === 0 ? <p className="p-5 text-sm text-muted-foreground">Noch keine Anfragen.</p> : latest.map((l) => (
            l.trade ? <Link key={l.id} to="/admin/inzahlungnahme/$id" params={{ id: l.id }} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4 hover:bg-muted/40">
              <span className="w-36 text-xs text-muted-foreground">{fmtDateTime(l.at)}</span>
              <span className="w-32 text-xs font-semibold uppercase text-primary">{l.type}</span>
              <span className="font-medium">{l.name}</span>
              <span className="text-sm text-muted-foreground">{l.info}</span>
              <span className="ml-auto"><LeadBadge status={l.status} /></span>
            </Link> : <Link key={l.id} to="/admin/anfragen" search={{ id: l.id }} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4 hover:bg-muted/40">
              <span className="w-36 text-xs text-muted-foreground">{fmtDateTime(l.at)}</span>
              <span className="w-32 text-xs font-semibold uppercase text-primary">{l.type}</span>
              <span className="font-medium">{l.name}</span>
              <span className="text-sm text-muted-foreground">{l.info}</span>
              <span className="ml-auto"><LeadBadge status={l.status} /></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
