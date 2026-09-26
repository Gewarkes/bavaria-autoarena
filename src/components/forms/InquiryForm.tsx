import { Link } from "@tanstack/react-router";
import { CheckCircle2, Phone } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { inquirySchema, submitInquiry } from "@/lib/inquiries";
import { cn } from "@/lib/utils";

type Kind = "probefahrt" | "anfrage" | "rueckruf";
const kinds: { value: Kind; label: string }[] = [
  { value: "probefahrt", label: "Probefahrt" }, { value: "anfrage", label: "Anfrage" }, { value: "rueckruf", label: "Rückruf" },
];
const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;

export function PrivacyNotice() {
  return <p className="text-xs leading-5 text-muted-foreground">Mit dem Absenden verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer Anfrage. Details in unserer <Link to="/datenschutz" className="font-semibold text-gold hover:text-gold-light">Datenschutzerklärung</Link>.</p>;
}

export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}><label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} /></label></div>;
}

export function InquirySuccess({ name }: { name: string }) {
  return <div role="status" className="rounded border border-success/50 bg-card p-6"><CheckCircle2 className="size-8 text-success" /><p className="mt-3 text-lg font-semibold text-foreground">Vielen Dank, {name}.</p><p className="mt-2 text-muted-foreground">Wir melden uns am nächsten Werktag.</p><a href={phoneHref} className="mt-4 inline-flex items-center gap-2 font-semibold text-silver underline underline-offset-4 hover:text-gold"><Phone className="size-4" />{siteConfig.phone}</a></div>;
}

export function InquiryError() {
  return <p role="alert" className="rounded-md border border-warning/50 bg-card p-3 text-sm text-foreground">Ihre Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an: <a href={phoneHref} className="font-semibold text-gold">{siteConfig.phone}</a></p>;
}

export function VehicleInquiryForm({ vehicleId, vehicleTitle, kind, onKindChange }: { vehicleId: string; vehicleTitle: string; kind: Kind; onKindChange: (k: Kind) => void }) {
  const startedAt = useRef(Date.now());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(`Ich interessiere mich für ${vehicleTitle}.`);
  const [marketing, setMarketing] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  useEffect(() => { startedAt.current = Date.now(); }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const input = { kind, name, phone, email, message: marketing ? `${message}\n\n[Werbekontakt erwünscht]` : message, vehicleId };
    const parsed = inquirySchema.safeParse(input);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      setErrors(next); return;
    }
    setErrors({}); setState("sending");
    const res = await submitInquiry(input, { honeypot, startedAt: startedAt.current });
    setState(res.ok ? "done" : "error");
  }

  if (state === "done") return <InquirySuccess name={name.trim()} />;
  return (
    <form onSubmit={submit} noValidate className="relative space-y-4">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div role="radiogroup" aria-label="Art der Anfrage" className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-background p-1">
        {kinds.map((k) => <button key={k.value} type="button" role="radio" aria-checked={kind === k.value} onClick={() => onKindChange(k.value)} className={cn("h-11 rounded text-sm font-semibold transition-colors", kind === k.value ? "bg-gold text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>{k.label}</button>)}
      </div>
      <Field label="Name *" error={errors["name"]}><Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="h-12" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Telefon" error={errors["phone"]}><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className="h-12" /></Field>
        <Field label="E-Mail" error={errors["email"]}><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="h-12" /></Field>
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">Telefon oder E-Mail genügt.</p>
      <Field label="Nachricht" error={errors["message"]}><Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} /></Field>
      <label className="flex items-start gap-3 text-sm text-muted-foreground"><Checkbox checked={marketing} onCheckedChange={(v) => setMarketing(v === true)} className="mt-0.5" />Ich möchte über passende Angebote informiert werden (optional, jederzeit widerrufbar).</label>
      {state === "error" ? <InquiryError /> : null}
      <PrivacyNotice />
      <Button type="submit" variant="gold" className="w-full" disabled={state === "sending"}>{state === "sending" ? "Wird gesendet …" : kind === "probefahrt" ? "Probefahrt anfragen" : kind === "rueckruf" ? "Rückruf anfordern" : "Anfrage senden"}</Button>
    </form>
  );
}

export function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}<div className="mt-2 normal-case tracking-normal">{children}</div>{error ? <span className="mt-1 block text-xs normal-case tracking-normal text-warning">{error}</span> : null}</label>;
}
