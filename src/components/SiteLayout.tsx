import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/format";
import { vehicleQuery } from "@/lib/vehicles";
import { Link, useRouterState } from "@tanstack/react-router";
import { CarFront, Menu, MessageCircle, Phone } from "lucide-react";
import { HeaderLogo, Logo, LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { currentOpeningStatus, isOpenNow, siteConfig } from "@/config/site";
import type { ReactNode } from "react";

const navItems = [
  { label: "Fahrzeuge", to: "/fahrzeuge" as const },
  { label: "Auto verkaufen", to: "/auto-verkaufen" as const },
  { label: "Leistungen", to: "/leistungen" as const },
  { label: "Finanzierung", to: "/finanzierung" as const },
  { label: "Über uns", to: "/ueber-uns" as const },
  { label: "Kontakt", to: "/kontakt" as const },
];

const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;

function Header() {
  const open = isOpenNow();
  return (
    <header className="sticky top-0 z-40 border-b-2 border-gold bg-background">
      <div className="mx-auto grid h-20 max-w-[1200px] grid-cols-[3rem_1fr_3rem] items-center px-6 md:flex md:h-24 md:px-12">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Menü öffnen"><Menu /></Button></SheetTrigger>
            <SheetContent side="left" className="w-[86%] bg-card pt-16">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => <SheetClose asChild key={item.to}><Link to={item.to} className="border-b border-border px-2 py-4 text-sm font-semibold text-foreground">{item.label}</Link></SheetClose>)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <Link to="/" aria-label="Bavaria Autoarena Startseite" className="justify-self-center md:mr-8 md:justify-self-auto"><HeaderLogo /></Link>
        <nav className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) => <Link key={item.to} to={item.to} activeProps={{ className: "text-gold" }} className="whitespace-nowrap text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">{item.label}</Link>)}
        </nav>
        <div className="ml-auto hidden items-center gap-3 xl:gap-5 md:flex">
          <a href={phoneHref} className="text-right">
            <span className="block whitespace-nowrap text-sm font-semibold text-foreground">{siteConfig.phone}</span>
            <span className={open ? "text-xs text-success" : "text-xs text-muted-foreground"}>{currentOpeningStatus()}</span>
          </a>
          <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp schreiben" className="grid size-10 place-items-center text-silver hover:text-gold"><WhatsAppIcon /></a>
          <Button asChild variant="gold" className="px-5"><Link to="/auto-verkaufen">Auto bewerten</Link></Button>
        </div>
        <a href={phoneHref} aria-label="Anrufen" className="ml-auto grid size-11 place-items-center text-gold md:hidden"><Phone className="size-5" /></a>
      </div>
    </header>
  );
}

const iconCls = "size-5 fill-current";
function WhatsAppIcon() { return <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>; }
const socialIcons = {
  tiktok: { label: "TikTok", path: "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z" },
  facebook: { label: "Facebook", path: "M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6A21 21 0 0 0 14.7 2.5c-2.3 0-3.9 1.4-3.9 4v2H8.2v3.2h2.6V21.5H14v-9.8h2.6l.4-3.2Z" },
  instagram: { label: "Instagram", path: "M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21 8c0-1.6-.4-3-1.6-4.2S16.8 2.1 15.2 2H8.8C7.2 2.1 5.8 2.5 4.6 3.7S3 6.4 3 8v8c0 1.6.4 3 1.6 4.2S7.2 21.9 8.8 22h6.4c1.6-.1 3-.5 4.2-1.7S21 17.6 21 16V8Zm-2 9.8a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.3.4s-4.1.1-5.3-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-4-.4-5.3s-.1-4.1.4-5.3A3 3 0 0 1 6.7 5.5C7.9 5 10.7 5.1 12 5.1s4.1-.1 5.3.4A3 3 0 0 1 19 7.2c.5 1.2.4 4 .4 5.3s.1 4.1-.4 5.3Z" },
  google: { label: "Google-Bewertungen", path: "M21.6 10.2H12v3.9h5.5c-.5 2.5-2.6 3.9-5.5 3.9a6 6 0 1 1 3.9-10.6l2.9-2.9A10 10 0 1 0 12 22c5 0 9.6-3.6 9.6-10 0-.6-.1-1.2 0-1.8Z" },
} as const;
function SocialLinks() {
  const entries = (Object.keys(socialIcons) as (keyof typeof socialIcons)[]).filter((k) => siteConfig.social[k]);
  if (!entries.length) return null;
  return <div className="mt-5 flex gap-3">{entries.map((k) => <a key={k} href={siteConfig.social[k]} target="_blank" rel="noopener noreferrer" aria-label={socialIcons[k].label} className="grid size-10 place-items-center rounded-full border border-border text-silver hover:border-gold/60 hover:text-gold"><svg viewBox="0 0 24 24" className={iconCls} aria-hidden="true"><path d={socialIcons[k].path} /></svg></a>)}</div>;
}

function Footer() {
  return (
    <footer className="bg-rauten-footer relative bg-darkest pb-24 pt-14 md:pb-8">
      <div className="gold-divider absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 sm:grid-cols-2 md:px-12 lg:grid-cols-4">
        <div><LogoMark size={96} className="mb-4" /><Logo /><p className="mt-4 text-sm font-semibold text-gold-light">Ihr Partner für Mobilität</p><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">Gebrauchtwagen in Perkam bei Straubing. Familienautos, SUV und Vans – selbst geprüft, mit Inzahlungnahme und Finanzierung.</p><SocialLinks /></div>
        <div><h2 className="footer-title">Kontakt</h2><address className="mt-4 space-y-2 text-sm not-italic text-muted-foreground"><p>{siteConfig.street}<br />{siteConfig.zip} {siteConfig.city}</p><a className="block hover:text-gold" href={phoneHref}>{siteConfig.phone}</a><a className="block break-all hover:text-gold" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><p>Mo–Fr 09:00–18:00<br />Sa 09:00–13:00 · So geschlossen</p></address></div>
        <div><h2 className="footer-title">Links</h2><nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">{navItems.map((item) => <Link key={item.to} to={item.to} className="hover:text-gold">{item.label}</Link>)}</nav></div>
        <div><h2 className="footer-title">Rechtliches</h2><nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground"><Link to="/impressum" className="hover:text-gold">Impressum</Link><Link to="/datenschutz" className="hover:text-gold">Datenschutz</Link></nav></div>
      </div>
      <div className="mx-auto mt-12 max-w-[1200px] px-6 md:px-12"><div className="gold-divider" /><div className="pt-6 text-xs leading-5 text-muted-foreground"><p>© 2026 Bavaria Autoarena GmbH · Perkam bei Straubing</p><p>Alle Preise sind Endpreise in Euro. Zwischenverkauf und Irrtum vorbehalten.</p></div></div>
    </footer>
  );
}

function MobileBottomBar({ vehicleTitle, price, url }: { vehicleTitle?: string | undefined; price?: string | undefined; url?: string | undefined }) {
  const text = vehicleTitle ? `Hallo, ich interessiere mich für ${vehicleTitle}${price ? ` (${price})` : ""}${url ? ` – ${url}` : ""}` : "Hallo Bavaria Autoarena, ich interessiere mich für ein Fahrzeug.";
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
  return <div className="fixed inset-x-0 bottom-0 z-50 grid h-18 grid-cols-3 border-t border-border bg-darkest p-2 md:hidden"><Button asChild variant="ghost" className="h-full flex-col gap-1 text-xs"><a href={phoneHref}><Phone />Anrufen</a></Button><Button asChild variant="ghost" className="h-full flex-col gap-1 text-xs"><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp</a></Button><Button asChild variant="gold" className="h-full flex-col gap-1 text-xs"><Link to="/auto-verkaufen"><CarFront />Auto verkaufen</Link></Button></div>;
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const detailMatch = pathname.match(/^\/fahrzeuge\/([^/]+)$/);
  const slug = detailMatch?.[1];
  const { data: vehicle } = useQuery({ ...vehicleQuery(slug ?? ""), enabled: !!slug });
  const [url, setUrl] = useState<string | undefined>(undefined);
  useEffect(() => { setUrl(slug ? window.location.href : undefined); }, [slug]);
  return <div className="min-h-screen bg-background pb-18 md:pb-0"><Header /><main>{children}</main><Footer />{slug && vehicle && url ? <MobileBottomBar vehicleTitle={vehicle.title} price={formatPrice(vehicle.price_eur)} url={url} /> : <MobileBottomBar />}</div>;
}