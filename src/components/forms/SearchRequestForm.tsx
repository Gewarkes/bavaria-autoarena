import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inquirySchema, submitInquiry } from "@/lib/inquiries";
import { Field, Honeypot, InquiryError, InquirySuccess, PrivacyNotice } from "./InquiryForm";

export function SearchRequestForm() {
  const startedAt = useRef(Date.now());
  const [wish, setWish] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const isMail = contact.includes("@");
    const input = { kind: "anfrage" as const, name, phone: isMail ? "" : contact, email: isMail ? contact : "", vehicleId: null,
      message: `Fahrzeugsuchauftrag\nWunschfahrzeug: ${wish.trim() || "-"}\nBudget: ${budget.trim() || "-"}` };
    const parsed = inquirySchema.safeParse(input);
    const next: Record<string, string> = {};
    if (!wish.trim()) next["wish"] = "Bitte beschreiben Sie Ihr Wunschfahrzeug.";
    if (!parsed.success) for (const i of parsed.error.issues) next[i.path[0] === "email" || i.path[0] === "phone" ? "contact" : String(i.path[0])] ??= i.message;
    if (Object.keys(next).length) { setErrors(next); return; }
    setErrors({}); setState("sending");
    const res = await submitInquiry(input, { honeypot, startedAt: startedAt.current });
    setState(res.ok ? "done" : "error");
  }

  if (state === "done") return <InquirySuccess name={name.trim()} />;
  return (
    <form onSubmit={submit} noValidate className="relative mt-6 space-y-4">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <Field label="Wunschfahrzeug *" error={errors["wish"]}><Input value={wish} onChange={(e) => setWish(e.target.value)} placeholder="z. B. VW Tiguan, Automatik, AHK" className="h-12" maxLength={200} /></Field>
      <Field label="Budget"><Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="z. B. bis 20.000 €" className="h-12" maxLength={60} /></Field>
      <Field label="Name *" error={errors["name"]}><Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="h-12" /></Field>
      <Field label="Telefon oder E-Mail *" error={errors["contact"]}><Input value={contact} onChange={(e) => setContact(e.target.value)} className="h-12" /></Field>
      {state === "error" ? <InquiryError /> : null}
      <PrivacyNotice />
      <Button type="submit" variant="silver" className="w-full" disabled={state === "sending"}>Suchauftrag senden</Button>
    </form>
  );
}
