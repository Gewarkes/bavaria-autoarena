import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { downloadCsv, fmtDateTime, INTENT_LABEL, listTradeIns, type LeadStatus } from "@/lib/admin";
import { formatKm } from "@/lib/format";
import { CleanupNotice, ErrorBox, LeadBadge, PageTitle, StatusChips, TableSkeleton } from "@/components/admin/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminTradeInsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "tradeins"], queryFn: listTradeIns });
  const [status, setStatus] = useState<LeadStatus | "alle">("alle");
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (data ?? []).filter((r) => (status === "alle" || r.status === status) && (!s || `${r.first_name} ${r.last_name} ${r.brand} ${r.model}`.toLowerCase().includes(s)));
  }, [data, status, q]);

  const exportCsv = () => downloadCsv(`inzahlungnahme-${new Date().toISOString().slice(0, 10)}.csv`, [
    ["Datum", "Vorname", "Nachname", "Marke", "Modell", "EZ", "km", "Absicht", "Kontaktweg", "Telefon", "E-Mail", "Status"],
    ...rows.map((r) => [fmtDateTime(r.created_at), r.first_name, r.last_name, r.brand, r.model, r.first_registration_year, r.mileage_km, INTENT_LABEL[r.intent] ?? r.intent, r.contact_channel, r.phone, r.email, r.status]),
  ]);

  return (
    <div>
      <PageTitle title="Inzahlungnahme-Anfragen"><Button variant="silver" onClick={exportCsv} disabled={!rows.length}><Download className="size-4" /> CSV-Export</Button></PageTitle>
      <CleanupNotice onDone={() => void qc.invalidateQueries({ queryKey: ["admin"] })} />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <StatusChips value={status} onChange={setStatus} />
        <div className="relative lg:ml-auto lg:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, Marke, Modell" className="h-10 pl-9" aria-label="Suche" /></div>
      </div>
      {error ? <ErrorBox error={error} /> : isLoading ? <TableSkeleton /> : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Datum</TableHead><TableHead>Name</TableHead><TableHead>Fahrzeug</TableHead><TableHead>km</TableHead><TableHead>Absicht</TableHead><TableHead>Kontaktweg</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 ? <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Keine Anfragen gefunden.</TableCell></TableRow> : rows.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => navigate({ to: "/admin/inzahlungnahme/$id", params: { id: r.id } })}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{fmtDateTime(r.created_at)}</TableCell>
                  <TableCell className="font-medium">{r.first_name} {r.last_name}</TableCell>
                  <TableCell>{r.brand} {r.model} {r.first_registration_year}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatKm(r.mileage_km)}</TableCell>
                  <TableCell>{INTENT_LABEL[r.intent] ?? r.intent}</TableCell>
                  <TableCell>{r.contact_channel ?? "–"}</TableCell>
                  <TableCell><LeadBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
