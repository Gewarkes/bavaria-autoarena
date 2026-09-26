import { useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Mail, Menu, MessageCircle, Phone } from "lucide-react";
import { HeaderLogo, LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { currentOpeningStatus, isOpenNow, phoneHref, siteConfig, whatsappHref } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { vehicleQuery } from "@/lib/vehicles";

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
  const open = isOpenNow();
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b border-cream/5 bg-navy-900 text-cream">
      <div className={`page-container flex items-center transition-[height] ${compact ? "h-17" : "h-16 lg:h-22"}`}>
        <Link to="/" aria-label="Bavaria Autoarena Startseite" className="shrink-0"><span className={compact ? "block scale-[.8] transition-transform" : "block transition-transform"}><HeaderLogo /></span></Link>
        <nav className="ml-10 hidden items-center gap-7 lg:flex">
          {navItems.map((item) => <Link key={item.to} to={item.to} activeProps={{ className: "text-gold-400" }} className="font-display text-[15px] font-normal text-cream/85 transition-colors hover:text-gold-400">{item.label}</Link>)}
        </nav>
        <div className="ml-auto hidden items-center gap-6 lg:flex">
          <a href={phoneHref} className="text-right"><span className="block font-display text-base font-normal text-gold-400">{siteConfig.phone}</span><span className="flex items-center justify-end gap-2 text-xs text-silver-400">{open ? <i className="size-1.5 rounded-full bg-success" /> : null}{currentOpeningStatus()}</span></a>
          <Button asChild variant="gold"><Link to="/kontakt" hash="termin">Termin vereinbaren</Link></Button>
        </div>
        <a href={phoneHref} aria-label="Anrufen" className="ml-auto grid size-11 place-items-center text-gold-400 lg:hidden"><Phone className="size-5" strokeWidth={1.5} /></a>
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Menü öffnen" className="text-cream hover:bg-navy-800"><Menu /></Button></SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col border-0 bg-navy-900 px-5 pb-7 pt-7 text-cream sm:max-w-full">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetClose asChild><Link to="/" className="inline-flex w-fit"><LogoMark size={72} /></Link></SheetClose>
              <nav className="mt-10 flex flex-col">
                {navItems.map((item) => <SheetClose asChild key={item.to}><Link to={item.to} activeProps={{ className: "text-gold-400" }} className="flex min-h-14 items-center border-b border-cream/10 font-display text-[28px] font-light uppercase tracking-[.06em]">{item.label}</Link></SheetClose>)}
              </nav>
              <div className="mt-auto border-t border-cream/10 pt-6"><p className="mb-4 text-sm text-silver-400">{currentOpeningStatus()}</p><Button asChild variant="gold" className="w-full"><a href={phoneHref}><Phone />Anrufen</a></Button><a href={whatsappHref("Hallo Bavaria Autoarena, ich habe eine Frage.")} target="_blank" rel="noopener noreferrer" className="tap-link mt-2 text-sm text-cream underline underline-offset-[6px]">WhatsApp schreiben</a><p className="mt-3 truncate text-xs text-silver-400">{siteConfig.street}, {siteConfig.zip} {siteConfig.city}</p></div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const pages = [...navItems.slice(0, 3), { label: "Finanzierung", to: "/finanzierung" as const }, ...navItems.slice(3)];
  return <footer className="relative bg-navy-950 pb-24 pt-20 text-cream md:pb-8"><div className="footer-diamond-band absolute inset-x-0 top-0 h-1.5" /><div className="page-container grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
    <div><LogoMark size={120} /><p className="mt-5 font-display text-xs font-light uppercase tracking-[.32em] text-silver-400">Ihr Partner für Mobilität</p><p className="mt-4 max-w-xs text-sm leading-6 text-silver-400">Gebrauchtwagen in Perkam bei Straubing – vom Alltagsauto bis zum Sportwagen.</p></div>
    <div><h2 className="footer-title">Kontakt</h2><div className="mt-5 flex flex-col text-sm text-silver-400"><a className="tap-link text-gold-400" href={phoneHref}>{siteConfig.phone}</a><a className="tap-link" href={whatsappHref()} target="_blank" rel="noopener noreferrer">WhatsApp schreiben</a><a className="tap-link break-all" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div></div>
    <div><h2 className="footer-title">Standort</h2><address className="mt-5 text-sm not-italic leading-7 text-silver-400">{siteConfig.street}<br />{siteConfig.zip} {siteConfig.city}<br /><span className="mt-3 block">Mo–Fr 9–18 Uhr<br />Sa 9–13 Uhr</span></address></div>
    <div><h2 className="footer-title">Seiten</h2><nav className="mt-5 grid grid-cols-2 gap-x-4 text-sm text-silver-400">{pages.map((item) => <Link key={item.to} to={item.to} className="tap-link hover:text-gold-400">{item.label}</Link>)}</nav></div>
  </div><div className="page-container mt-14 border-t border-cream/10 pt-6 text-xs leading-6 text-silver-400"><div className="flex flex-wrap gap-x-6"><p>© {new Date().getFullYear()} Bavaria Autoarena GmbH</p><Link to="/impressum">Impressum</Link><Link to="/datenschutz">Datenschutz</Link><a href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a><a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></div><p>Alle Preise sind Endpreise in Euro. Zwischenverkauf und Irrtum vorbehalten.</p></div></footer>;
}

function FloatingContact({ show }: { show: boolean }) {
  if (!show) return null;
  const items = [
    { label: siteConfig.phone, href: phoneHref, icon: <Phone />, className: "bg-gold-500 text-navy-900" },
    { label: "WhatsApp schreiben", href: whatsappHref(), icon: <WhatsAppIcon />, className: "bg-whatsapp text-navy-900" },
    { label: "E-Mail senden", href: `mailto:${siteConfig.email}`, icon: <Mail />, className: "bg-navy-800 text-cream" },
  ];
  return <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col lg:flex">{items.map((item) => <a key={item.label} href={item.href} className={`group ml-auto flex h-13 w-13 items-center overflow-hidden transition-[width] hover:w-[220px] ${item.className}`}><span className="grid size-13 shrink-0 place-items-center [&_svg]:size-5">{item.icon}</span><span className="whitespace-nowrap pr-5 text-sm font-semibold">{item.label}</span></a>)}</div>;
}

function MobileBottomBar({ vehicleTitle, price, url, show }: { vehicleTitle?: string; price?: string; url?: string; show: boolean }) {
  if (!show) return null;
  const text = vehicleTitle ? `Hallo, ich interessiere mich für ${vehicleTitle}${price ? ` (${price})` : ""}${url ? ` – ${url}` : ""}` : "Hallo Bavaria Autoarena, ich habe eine Frage.";
  const whatsappUrl = whatsappHref(text);
  if (vehicleTitle && price) return <div className="fixed inset-x-0 bottom-0 z-50 grid min-h-16 grid-cols-[auto_1fr_auto_auto] items-center gap-1 border-t border-cream/10 bg-navy-950 px-2 pb-[env(safe-area-inset-bottom)] text-cream md:hidden"><span className="whitespace-nowrap px-1 font-display text-lg font-bold">{price}</span><Button asChild variant="gold" className="min-h-11 px-2 text-[11px]"><a href="#anfrage">Probefahrt anfragen</a></Button><Button asChild variant="ghost" size="icon" className="size-11" aria-label="Anrufen"><a href={phoneHref}><Phone /></a></Button><Button asChild variant="ghost" size="icon" className="size-11" aria-label="WhatsApp"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle /></a></Button></div>;
  return <div className="fixed inset-x-0 bottom-0 z-50 grid min-h-16 grid-cols-3 border-t border-cream/10 pb-[env(safe-area-inset-bottom)] text-[11px] md:hidden"><a href={phoneHref} className="flex flex-col items-center justify-center bg-gold-500 font-display uppercase tracking-[.08em] text-navy-900"><Phone className="mb-1 size-4" />Anrufen</a><a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center bg-whatsapp font-display uppercase tracking-[.08em] text-navy-900"><WhatsAppIcon className="mb-1 size-4" />WhatsApp</a><Link to="/kontakt" hash="termin" className="flex flex-col items-center justify-center bg-navy-900 font-display uppercase tracking-[.08em] text-cream"><ChevronRight className="mb-1 size-4" />Termin</Link></div>;
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const detailMatch = pathname.match(/^\/fahrzeuge\/([^/]+)$/);
  const slug = detailMatch?.[1];
  const { data: vehicle } = useQuery({ ...vehicleQuery(slug ?? ""), enabled: !!slug });
  const [url, setUrl] = useState<string>();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { setUrl(slug ? window.location.href : undefined); }, [slug]);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 500); fn(); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  const hideBar = pathname === "/auto-verkaufen";
  return <div className={hideBar ? "min-h-screen bg-background" : "min-h-screen bg-background pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0"}><Header /><main>{children}</main><Footer /><FloatingContact show={scrolled} />{hideBar ? null : slug && vehicle && url ? <MobileBottomBar show vehicleTitle={vehicle.title} price={formatPrice(vehicle.price_eur)} url={url} /> : <MobileBottomBar show={scrolled} />}</div>;
}