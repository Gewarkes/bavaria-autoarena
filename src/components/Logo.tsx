import { cn } from "@/lib/utils";

/** Querformat-Logo (public/logo.svg, 705.75 × 225). Höhe über className steuern, Breite folgt automatisch. */
export function Logo({ className }: { className?: string }) {
  return <img src="/logo.svg" alt="Bavaria Autoarena" width={706} height={225} className={cn("h-16 w-auto shrink-0", className)} />;
}

/** Nur das Wappenschild (public/logo-schild.svg, 128 × 162). */
export function LogoMark({ className }: { className?: string }) {
  return <img src="/logo-schild.svg" alt="Bavaria Autoarena" width={128} height={162} className={cn("h-10 w-auto shrink-0", className)} />;
}

/** Header: Querformat-Logo, unter 360 px nur das Schild. */
export function HeaderLogo({ compact = false }: { compact?: boolean }) {
  return <>
    <LogoMark className="h-11 min-[360px]:hidden" />
    <Logo className={cn("hidden h-11 transition-[height] duration-300 min-[360px]:block", compact ? "lg:h-14" : "lg:h-[60px]")} />
  </>;
}
