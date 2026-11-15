import { useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitInquiry, inquirySchema, type InquiryInput } from "@/lib/inquiries";
import { phoneHref, siteConfig } from "@/config/site";

export type Basics = { name: string; phone: string; email: string };

export function useLeadForm() {
  const startedAt = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");
  const [basics, setBasics] = useState<Basics>({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function send(input: Omit<InquiryInput, "name" | "phone" | "email">) {
    const payload = { ...input, name: basics.name, phone: basics.phone, email: basics.email };
    const parsed = inquirySchema.safeParse(payload);
    if (!parsed.success) {
      const out: Record<string, string> = {};
      for (const i of parsed.error.issues) { const k = String(i.path[0]); if (!out[k]) out[k] = i.message; }
      setErrors(out); return;
    }
    setErrors({}); setState("busy");
    const res = await submitInquiry(payload, { honeypot, startedAt: startedAt.current });
    setState(res.ok ? "done" : "error");
  }
  return { basics, setBasics, errors, state, send, honeypot, setHoneypot };
}

export function LeadBasicsFields({ form }: { form: ReturnType<typeof useLeadForm> }) {
  const { basics, setBasics, errors, honeypot, setHoneypot } = form;
  const lbl = "block text-xs font-semibold uppercase tracking-wide text-muted-foreground";
  return (
    <>
      <label className={lbl}>Name <span className="text-primary">*</span><Input className="mt-2 h-12" autoComplete="name" enterKeyHint="next" maxLength={100} value={basics.name} onChange={(e) => setBasics({ ...basics, name: e.target.value })} /></label>
      {errors["name"] && <p className="text-sm text-destructive">{errors["name"]}</p>}
      <p className="text-sm text-muted-foreground">Telefon oder E-Mail – mindestens eines davon.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={lbl}>Telefon<Input className="mt-2 h-12" type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="next" maxLength={40} value={basics.phone} onChange={(e) => setBasics({ ...basics, phone: e.target.value })} /></label>
        <label className={lbl}>E-Mail<Input className="mt-2 h-12" type="email" inputMode="email" autoComplete="email" enterKeyHint="next" maxLength={255} value={basics.email} onChange={(e) => setBasics({ ...basics, email: e.target.value })} /></label>
      </div>
      {(errors["phone"] || errors["email"]) && <p className="text-sm text-destructive">{errors["phone"] ?? errors["email"]}</p>}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><input tabIndex={-1} autoComplete="off" name="hp_field" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></div>
    </>
  );
}

export function LeadSubmit({ form, label }: { form: ReturnType<typeof useLeadForm>; label: string }) {
  return (
    <>
      {form.state === "error" && <p role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-foreground">Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns an: <a href={phoneHref} className="text-primary underline">{siteConfig.phone}</a></p>}
      <Button type="submit" variant="brand" disabled={form.state === "busy"} className="w-full sm:w-auto">{form.state === "busy" && <Loader2 className="animate-spin" />}{label}</Button>
    </>
  );
}

export function LeadSuccess({ children }: { children: string }) {
  return <div role="status" className="flex items-start gap-3 rounded-lg border border-success/40 bg-success/10 p-5 text-foreground"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" /><p>{children}</p></div>;
}
