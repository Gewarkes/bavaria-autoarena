import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) { setError("Anmeldung fehlgeschlagen. Bitte prüfen Sie E-Mail und Passwort."); return; }
    navigate({ to: "/admin", replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-sm bg-background p-8 text-foreground">
        <div className="mb-8 flex justify-center"><Logo className="h-14" /></div>
        <h1 className="text-center font-display text-lg font-light uppercase tracking-[.06em]">Verwaltung – Anmeldung</h1>
        <div className="mt-6 space-y-4">
          <div className="space-y-2"><Label htmlFor="email">E-Mail</Label><Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" /></div>
          <div className="space-y-2"><Label htmlFor="pw">Passwort</Label><Input id="pw" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" /></div>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" variant="brand" className="w-full" disabled={busy}>{busy ? "Anmeldung läuft …" : "Anmelden"}</Button>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">Zugang vergessen? Bitte an die Geschäftsführung wenden.</p>
      </form>
    </div>
  );
}
