import { useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Menu, Phone } from "lucide-react";
import { HeaderLogo, Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { currentOpeningStatus, phoneHref, siteConfig, whatsappHref } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { coverImage, vehicleQuery } from "@/lib/vehicles";
import { openTermin, type TerminVehicle } from "@/lib/termin";
import { sizedImage } from "@/lib/vehicleImages";
import { TerminHost } from "@/components/termin/TerminDialog";

const navItems = [
  { label: "Fahrzeuge", to: "/fahrzeuge" as const },
  { label: "Ankauf", to: "/auto-verkaufen" as const },
  { label: "Service", to: "/leistungen" as const },
  { label: "Über uns", to: "/ueber-uns" as const },
  { label: "Kontakt", to: "/kontakt" as const },
];

function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>;
}

function Header() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-50 text-foreground transition-colors duration-300 ${compact ? "border-b border-border bg-ink-950/85 backdrop-blur-md" : "border-b border-transparent bg-ink-950"}`}>
      <div className={`page-container flex items-center gap-4 transition-[height] duration-300 ${compact ? "h-16 lg:h-[72px]" : "h-16 lg:h-[88px]"}`}>
        <Link to="/" aria-label="Bavaria Autoarena Startseite" className="flex shrink-0 items-center"><HeaderLogo compact={compact} /></Link>
        <nav aria-label="Hauptnavigation" className="mx-auto hidden items-center gap-8 lg:flex">
          {navItems.map((item) => <Link key={item.to} to={item.to} activeProps={{ className: "!text-primary border-primary" }} className="border-b border-transparent py-2 font-display text-[13px] font-normal uppercase tracking-[.16em] text-foreground/85 transition-colors hover:text-tiffany-300">{item.label}</Link>)}
        </nav>
        <div className="ml-auto hidden items-center gap-6 lg:ml-0 lg:flex">
          <a href={phoneHref} className="text-right"><span className="block font-display text-base font-normal text-foreground transition-colors hover:text-tiffany-300">{siteConfig.phone}</span><span className="block text-[13px] text-subtle">Termine nach Vereinbarung</span></a>
          <Button type="button" variant="brand" onClick={() => openTermin()}>Termin vereinbaren</Button>
        </div>
        <a href={phoneHref} aria-label="Anrufen" className="ml-auto grid size-11 place-items-center text-primary lg:hidden"><Phone className="size-5" strokeWidth={1.5} /></a>
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Menü öffnen" className="size-11 text-foreground hover:bg-ink-800"><Menu /></Button></SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col border-0 bg-ink-950 px-6 pb-7 pt-6 text-foreground sm:max-w-full">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetClose asChild><Link to="/" className="inline-flex w-fit"><Logo className="h-11" /></Link></SheetClose>
              <span aria-hidden="true" className="brand-line mt-6 block h-px w-full opacity-60" />
              <nav className="mt-6 flex flex-col">
                {navItems.map((item) => <SheetClose asChild key={item.to}><Link to={item.to} activeProps={{ className: "text-primary" }} className="flex min-h-14 items-center border-b border-border font-display text-[26px] font-light uppercase tracking-[.08em]">{item.label}</Link></SheetClose>)}
              </nav>
              <div className="mt-auto pt-6"><p className="mb-4 text-sm text-muted-foreground">{currentOpeningStatus()}</p><Button asChild variant="brand" className="w-full"><a href={phoneHref}><Phone />Anrufen</a></Button><a href={whatsappHref("Hallo Bavaria Autoarena, ich habe eine Frage.")} target="_blank" rel="noopener noreferrer" className="tap-link mt-2 text-sm text-foreground underline underline-offset-[6px]">WhatsApp schreiben</a><p className="mt-3 truncate text-xs text-subtle">{siteConfig.street}, {siteConfig.zip} {siteConfig.city}</p></div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const pages = [...navItems.slice(0, 3), { label: "Finanzierung", to: "/finanzierung" as const }, ...navItems.slice(3)];
  return <footer className="bg-rauten relative bg-ink-950 pb-24 pt-20 text-foreground md:pb-8"><div aria-hidden="true" className="brand-line absolute inset-x-0 top-0 h-px" /><div className="page-container grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
    <div><Logo className="h-16" /><p className="mt-6 max-w-xs text-sm leading-6 text-muted-foreground">Gebrauchtwagen in Perkam bei Straubing – vom Alltagsauto bis zum Sportwagen.</p></div>
    <div><h2 className="footer-title">Kontakt</h2><div className="mt-5 flex flex-col text-sm text-muted-foreground"><a className="tap-link text-foreground hover:text-tiffany-300" href={phoneHref}>{siteConfig.phone}</a><a className="tap-link hover:text-tiffany-300" href={siteConfig.mobileHref}>Mobil: {siteConfig.mobile}</a><a className="tap-link hover:text-tiffany-300" href={whatsappHref()} target="_blank" rel="noopener noreferrer">WhatsApp schreiben</a><Link className="tap-link hover:text-tiffany-300" to="/kontakt">Kontaktformular</Link></div></div>
    <div><h2 className="footer-title">Standort &amp; Termine</h2><address className="mt-5 text-sm not-italic leading-7 text-muted-foreground">{siteConfig.street}<br />{siteConfig.zip} {siteConfig.city}<br /><span className="mt-3 block">{siteConfig.appointmentHours}</span></address></div>
    <div><h2 className="footer-title">Seiten</h2><nav className="mt-5 grid grid-cols-2 gap-x-4 text-sm text-muted-foreground">{pages.map((item) => <Link key={item.to} to={item.to} className="tap-link hover:text-tiffany-300">{item.label}</Link>)}</nav></div>
  </div><div className="page-container mt-14 border-t border-border pt-6 text-xs leading-6 text-subtle"><div className="flex flex-wrap gap-x-6"><p>© {new Date().getFullYear()} Bavaria Autoarena GmbH</p><Link className="hover:text-tiffany-300" to="/impressum">Impressum</Link><Link className="hover:text-tiffany-300" to="/datenschutz">Datenschutz</Link><a className="hover:text-tiffany-300" href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a><a className="hover:text-tiffany-300" href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></div><p>Alle Preise sind Endpreise in Euro. Zwischenverkauf und Irrtum vorbehalten.</p></div></footer>;
}

function MobileBottomBar({ vehicleTitle, price, url, show, terminVehicle }: { vehicleTitle?: string; price?: string; url?: string; show: boolean; terminVehicle?: TerminVehicle }) {
  if (!show) return null;
  const text = vehicleTitle ? `Hallo, ich interessiere mich für ${vehicleTitle}${price ? ` (${price})` : ""}${url ? ` – ${url}` : ""}` : "Hallo Bavaria Autoarena, ich habe eine Frage.";
  const whatsappUrl = whatsappHref(text);
  if (vehicleTitle && price && terminVehicle) return <div className="fixed inset-x-0 bottom-0 z-50 flex min-h-16 items-center gap-2 border-t border-foreground/10 bg-ink-950/95 backdrop-blur-md px-3 pb-[env(safe-area-inset-bottom)] text-foreground md:hidden"><span className="mr-auto whitespace-nowrap font-display text-xl font-light tabular-nums">{price}</span><Button asChild variant="brand" size="icon" className="size-11" aria-label="Anrufen"><a href={phoneHref}><Phone strokeWidth={1.5} /></a></Button><Button type="button" variant="outline" className="h-11 border-foreground px-4 text-xs text-foreground" onClick={() => openTermin({ vehicle: terminVehicle, topic: "Probefahrt" })}>Probefahrt</Button></div>;
  return <div className="fixed inset-x-0 bottom-0 z-50 grid min-h-16 grid-cols-3 border-t border-border bg-ink-950/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] text-xs md:hidden"><a href={phoneHref} className="flex flex-col items-center justify-center bg-primary font-display uppercase tracking-[.08em] text-primary-foreground"><Phone className="mb-1 size-4" />Anrufen</a><a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center font-display uppercase tracking-[.08em] text-foreground"><WhatsAppIcon className="mb-1 size-4 text-whatsapp" />WhatsApp</a><button type="button" onClick={() => openTermin()} className="m-1 flex flex-col items-center justify-center border border-foreground/40 font-display uppercase tracking-[.08em] text-foreground"><ChevronRight className="mb-1 size-4" />Termin</button></div>;
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const detailMatch = pathname.match(/^\/fahrzeuge\/([^/]+)$/);
  const slug = detailMatch?.[1];
  const { data: vehicle } = useQuery({ ...vehicleQuery(slug ?? ""), enabled: !!slug });
  const [url, setUrl] = useState<string>();
  useEffect(() => { setUrl(slug ? window.location.href : undefined); }, [slug]);
  const hideBar = pathname === "/auto-verkaufen";
  return <div className={hideBar ? "min-h-screen bg-background" : "min-h-screen bg-background pb-20 md:pb-0"}><Header /><main>{children}</main><Footer /><TerminHost />{hideBar ? null : slug && vehicle && url ? <MobileBottomBar show vehicleTitle={vehicle.title} price={formatPrice(vehicle.price_eur)} url={url} terminVehicle={{ id: vehicle.id, title: vehicle.title, price: formatPrice(vehicle.price_eur), image: coverImage(vehicle) ? sizedImage(coverImage(vehicle)!.url, "card") : undefined }} /> : <MobileBottomBar show />}</div>;
}