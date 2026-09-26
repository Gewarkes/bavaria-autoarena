import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Download, Mail, MessageCircle, Phone, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteInquiry, downloadCsv, fmtDateTime, KIND_LABEL, listInquiries, updateInquiry, type LeadStatus } from "@/lib/admin";
import { ErrorBox, LeadBadge, LeadEditor, PageTitle, StatusChips, TableSkeleton, waLink } from "@/components/admin/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminInquiriesPage({ selectedId }: { selectedId?: string | undefined }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "inquiries"], queryFn: listInquiries });
  const [status, setStatus] = useState<LeadStatus | "alle">("alle");
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (data ?? []).filter((r) => (status === "alle" || r.status === status) && (!s || `${r.name} ${r.vehicles?.title ?? ""} ${r.email ?? ""}`.toLowerCase().includes(s)));
  }, [data, status, q]);
  const sel = data?.find((r) => r.id === selectedId);
  const select = (id?: string) => navigate({ to: "/admin/anfragen", search: id ? { id } : {}, replace: true });

  const exportCsv = () => downloadCsv(`fahrzeuganfragen-${new Date().toISOString().slice(0, 10)}.csv`, [
    ["Datum", "Art", "Name", "Fahrzeug", "Telefon", "E-Mail", "Nachricht", "Status"],
    ...rows.map((r) => [fmtDateTime(r.created_at), KIND_LABEL[r.kind] ?? r.kind, r.name, r.vehicles?.title, r.phone, r.email, r.message, r.status]),
  ]);
  const save = async (patch: Parameters<typeof updateInquiry>[1]) => { await updateInquiry(sel!.id, patch); await qc.invalidateQueries({ queryKey: ["admin"] }); };
  const remove = async () => {
    if (!sel || !window.confirm("Anfrage endgültig löschen?")) return;
    try { await deleteInquiry(sel.id); await qc.invalidateQueries({ queryKey: ["admin"] }); toast.success("Anfrage gelöscht."); select(); } catch { toast.error("Löschen fehlgeschlagen."); }
  };

  return (
    <div>
      <PageTitle title="Fahrzeuganfragen"><Button variant="silver" onClick={exportCsv} disabled={!rows.length}><Download className="size-4" /> CSV-Export</Button></PageTitle>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <StatusChips value={status} onChange={setStatus} />
        <div className="relative lg:ml-auto lg:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, Fahrzeug" className="h-10 pl-9" aria-label="Suche" /></div>
      </div>
      {error ? <ErrorBox error={error} /> : isLoading ? <TableSkeleton /> : (
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Datum</TableHead><TableHead>Art</TableHead><TableHead>Name</TableHead><TableHead>Fahrzeug</TableHead><TableHead>Kontakt</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.length === 0 ? <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Keine Anfragen gefunden.</TableCell></TableRow> : rows.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => select(r.id)}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{fmtDateTime(r.created_at)}</TableCell>
                  <TableCell>{KIND_LABEL[r.kind] ?? r.kind}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.vehicles ? <Link to="/fahrzeuge/$slug" params={{ slug: r.vehicles.slug }} target="_blank" onClick={(e) => e.stopPropagation()} className="text-gold underline">{r.vehicles.title}</Link> : "–"}</TableCell>
                  <TableCell className="text-sm">{r.phone ?? r.email ?? "–"}</TableCell>
                  <TableCell><LeadBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Sheet open={!!sel} onOpenChange={(o) => !o && select()}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {sel ? <>
            <SheetHeader><SheetTitle className="font-display uppercase tracking-wide">{sel.name}</SheetTitle></SheetHeader>
            <div className="mt-4 space-y-5 text-sm">
              <dl className="grid grid-cols-[8rem_1fr] gap-y-2">
                <dt className="text-muted-foreground">Eingang</dt><dd>{fmtDateTime(sel.created_at)}</dd>
                <dt className="text-muted-foreground">Art</dt><dd>{KIND_LABEL[sel.kind] ?? sel.kind}</dd>
                <dt className="text-muted-foreground">Fahrzeug</dt><dd>{sel.vehicles ? <Link to="/fahrzeuge/$slug" params={{ slug: sel.vehicles.slug }} target="_blank" className="text-gold underline">{sel.vehicles.title}</Link> : "–"}</dd>
                <dt className="text-muted-foreground">Telefon</dt><dd>{sel.phone ? <span className="flex flex-wrap gap-3"><a className="inline-flex items-center gap-1 text-gold underline" href={`tel:${sel.phone}`}><Phone className="size-3.5" />{sel.phone}</a><a className="inline-flex items-center gap-1 text-gold underline" href={waLink(sel.phone)} target="_blank" rel="noreferrer"><MessageCircle className="size-3.5" />WhatsApp</a></span> : "–"}</dd>
                <dt className="text-muted-foreground">E-Mail</dt><dd>{sel.email ? <a className="inline-flex items-center gap-1 text-gold underline" href={`mailto:${sel.email}`}><Mail className="size-3.5" />{sel.email}</a> : "–"}</dd>
                <dt className="text-muted-foreground">Datenschutz</dt><dd>{sel.privacy_notice_version}</dd>
              </dl>
              <div><p className="mb-1 text-muted-foreground">Nachricht</p><p className="whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3">{sel.message || "–"}</p></div>
              <LeadEditor status={sel.status} notes={sel.internal_notes} onSave={save} />
              <Button variant="destructive" className="w-full" onClick={remove}><Trash2 className="size-4" /> Löschen</Button>
            </div>
          </> : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
