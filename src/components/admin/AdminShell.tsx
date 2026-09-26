import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CarFront, ClipboardList, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Repeat2, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo, LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

type AuthState = { status: "loading" } | { status: "anon" } | { status: "noadmin"; email: string } | { status: "admin"; email: string };

export function useAdminAuth() {
  const [state, setState] = useState<AuthState>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) { if (alive) setState({ status: "anon" }); return; }
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (alive) setState(isAdmin ? { status: "admin", email: user.email ?? "" } : { status: "noadmin", email: user.email ?? "" });
    };
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void check();
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);
  return state;
}

function useSignOut() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };
}

const nav = [
  { to: "/admin" as const, label: "Übersicht", icon: LayoutDashboard, exact: true },
  { to: "/admin/inzahlungnahme" as const, label: "Inzahlungnahme-Anfragen", icon: Repeat2 },
  { to: "/admin/anfragen" as const, label: "Fahrzeuganfragen", icon: ClipboardList },
  { to: "/admin/fahrzeuge" as const, label: "Fahrzeuge", icon: CarFront },
  { to: "/admin/kundenstimmen" as const, label: "Kundenstimmen", icon: MessageSquareQuote },
];

function NavLinks({ wrap }: { wrap?: (n: ReactNode, key: string) => ReactNode }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon, exact }) => {
        const link = <Link key={to} to={to} activeOptions={{ exact: !!exact }} activeProps={{ className: "bg-muted text-gold" }} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"><Icon className="size-4" />{label}</Link>;
        return wrap ? wrap(link, to) : link;
      })}
    </nav>
  );
}

/** ProtectedRoute: nur UX – die eigentliche Sicherheit liegt in den RLS-Policies. */
export function AdminShell() {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const signOut = useSignOut();
  useEffect(() => { if (auth.status === "anon") navigate({ to: "/admin/login", replace: true }); }, [auth.status, navigate]);

  if (auth.status === "loading" || auth.status === "anon") {
    return <div className="flex min-h-screen items-center justify-center bg-background"><Skeleton className="h-10 w-48" /></div>;
  }
  if (auth.status === "noadmin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center">
          <ShieldAlert className="mx-auto size-10 text-warning" />
          <h1 className="mt-4 font-display text-xl font-bold uppercase tracking-wide">Kein Zugriff</h1>
          <p className="mt-2 text-sm text-muted-foreground">Das Konto {auth.email} hat keine Berechtigung für den Verwaltungsbereich.</p>
          <Button variant="silver" className="mt-6" onClick={signOut}><LogOut /> Abmelden</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-darkest p-4 lg:flex">
        <Link to="/admin" className="mb-8 flex items-center gap-3 px-2 pt-2"><LogoMark size={44} /><Logo /></Link>
        <NavLinks />
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-8">
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menü öffnen"><Menu /></Button></SheetTrigger>
            <SheetContent side="left" className="w-72 bg-darkest pt-12">
              <SheetTitle className="mb-6 px-2"><Logo /></SheetTitle>
              <NavLinks wrap={(n, k) => <SheetClose asChild key={k}>{n}</SheetClose>} />
            </SheetContent>
          </Sheet>
          <span className="font-display text-xs font-bold uppercase tracking-wide text-gold">Verwaltung</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{auth.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="size-4" /> Abmelden</Button>
          </div>
        </header>
        <main className="p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
