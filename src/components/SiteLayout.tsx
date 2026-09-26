import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/format";
import { vehicleQuery } from "@/lib/vehicles";
import { Link, useRouterState } from "@tanstack/react-router";
import { CarFront, Menu, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { currentOpeningStatus, isOpenNow, siteConfig } from "@/config/site";
import type { ReactNode } from "react";

const navItems = [
  { label: "Fahrzeuge", to: "/fahrzeuge" as const },
  { label: "Auto verkaufen", to: "/auto-verkaufen" as const },
  { label: "Finanzierung", to: "/finanzierung" as const },
  { label: "Über uns", to: "/ueber-uns" as const },
  { label: "Kontakt", to: "/kontakt" as const },
];

const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;

function Header() {
  const open = isOpenNow();
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[3rem_1fr_3rem] items-center px-4 md:flex md:h-24 md:px-6">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Menü öffnen"><Menu /></Button></SheetTrigger>
            <SheetContent side="left" className="w-[86%] bg-card pt-16">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => <SheetClose asChild key={item.to}><Link to={item.to} className="border-b border-border px-2 py-4 font-display text-sm font-bold uppercase tracking-wide text-foreground">{item.label}</Link></SheetClose>)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <Link to="/" aria-label="Bavaria Autoarena Startseite" className="justify-self-center md:mr-10 md:justify-self-auto"><Logo /></Link>
        <nav className="hidden items-center gap-6 xl:flex">
          {navItems.map((item) => <Link key={item.to} to={item.to} activeProps={{ className: "text-gold" }} className="font-display text-xs font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground">{item.label}</Link>)}
        </nav>
        <div className="ml-auto hidden items-center gap-5 md:flex">
          <a href={phoneHref} className="text-right">
            <span className="block text-sm font-semibold text-foreground">{siteConfig.phone}</span>
            <span className={open ? "text-xs text-success" : "text-xs text-muted-foreground"}>{currentOpeningStatus()}</span>
          </a>
          <Button asChild variant="gold"><Link to="/auto-verkaufen">Fahrzeug bewerten</Link></Button>
        </div>
        <Phone className="ml-auto size-5 text-gold md:hidden" aria-hidden="true" />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-rauten-footer relative bg-darkest pb-24 pt-14 md:pb-8">
      <div className="gold-divider absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div><Logo /><p className="mt-4 font-display text-sm font-bold uppercase tracking-wide text-gold-light">Ihr Partner für Mobilität</p><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">Ausgewählte Gebrauchtwagen und persönliche Beratung in unserem neuen Autohaus in Perkam.</p></div>
        <div><h2 className="footer-title">Kontakt</h2><address className="mt-4 space-y-2 text-sm not-italic text-muted-foreground"><p>{siteConfig.street}<br />{siteConfig.zip} {siteConfig.city}</p><a className="block hover:text-gold" href={phoneHref}>{siteConfig.phone}</a><a className="block break-all hover:text-gold" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><p>Mo–Fr 09:00–18:00<br />Sa 09:00–13:00 · So geschlossen</p></address></div>
        <div><h2 className="footer-title">Links</h2><nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">{navItems.map((item) => <Link key={item.to} to={item.to} className="hover:text-gold">{item.label}</Link>)}</nav></div>
        <div><h2 className="footer-title">Rechtliches</h2><nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground"><Link to="/impressum" className="hover:text-gold">Impressum</Link><Link to="/datenschutz" className="hover:text-gold">Datenschutz</Link></nav></div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-5 lg:px-6"><div className="gold-divider" /><div className="pt-6 text-xs leading-5 text-muted-foreground"><p>© 2026 Bavaria Autoarena GmbH · Perkam bei Straubing</p><p>Alle Preise sind Endpreise in Euro. Zwischenverkauf und Irrtum vorbehalten.</p></div></div>
    </footer>
  );
}

function MobileBottomBar({ vehicleTitle, price, url }: { vehicleTitle?: string; price?: string; url?: string }) {
  const text = vehicleTitle ? `Hallo, ich interessiere mich für ${vehicleTitle}${price ? ` (${price})` : ""}${url ? ` – ${url}` : ""}` : "Hallo Bavaria Autoarena, ich interessiere mich für ein Fahrzeug.";
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
  return <div className="fixed inset-x-0 bottom-0 z-50 grid h-18 grid-cols-3 border-t border-border bg-darkest/95 p-2 backdrop-blur md:hidden"><Button asChild variant="ghost" className="h-full flex-col gap-1 text-xs"><a href={phoneHref}><Phone />Anrufen</a></Button><Button asChild variant="ghost" className="h-full flex-col gap-1 text-xs"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp</a></Button><Button asChild variant="gold" className="h-full flex-col gap-1 text-xs"><Link to="/auto-verkaufen"><CarFront />Auto verkaufen</Link></Button></div>;
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const detailMatch = pathname.match(/^\/fahrzeuge\/([^/]+)$/);
  const slug = detailMatch?.[1];
  const { data: vehicle } = useQuery({ ...vehicleQuery(slug ?? ""), enabled: !!slug });
  const url = slug && typeof window !== "undefined" ? window.location.href : undefined;
  return <div className="min-h-screen bg-background pb-18 md:pb-0"><Header /><main>{children}</main><Footer />{slug && vehicle ? <MobileBottomBar vehicleTitle={vehicle.title} price={formatPrice(vehicle.price_eur)} url={url} /> : <MobileBottomBar />}</div>;
}