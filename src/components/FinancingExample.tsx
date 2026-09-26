import { siteConfig } from "@/config/site";

/** Repräsentatives Beispiel nach § 6a PAngV. Nur rendern, wenn features.showMonthlyRate true ist. */
export function FinancingExample() {
  const e = siteConfig.financingExample;
  const rows: [string, string][] = [
    ["Barzahlungspreis", e.cashPrice], ["Anzahlung", e.downPayment], ["Nettodarlehensbetrag", e.netLoan], ["Laufzeit", e.months],
    ["Monatliche Rate", e.monthlyRate], ["Schlussrate", e.finalRate], ["Sollzinssatz (gebunden) p. a.", e.nominalRate],
    ["Effektiver Jahreszins", e.effectiveRate], ["Gesamtbetrag", e.total],
  ];
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">Repräsentatives Beispiel nach § 6a PAngV</h2>
      <dl className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">{rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-border py-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-right text-foreground">{v}</dd></div>)}</dl>
      <p className="mt-4 text-xs text-muted-foreground">Darlehensgeber: {e.bank}. Bonität vorausgesetzt.</p>
    </section>
  );
}
