import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex flex-col leading-none", className)} aria-label="Bavaria Autoarena">
      <span className="mb-1 pl-0.5 font-display text-[0.57rem] font-bold tracking-[0.38em] text-gold-light">
        BAVARIA
      </span>
      <span className="font-display text-[1.15rem] font-extrabold tracking-wide sm:text-[1.35rem]">
        <span className="text-silver-gradient">AUTO</span>
        <span className="text-gold-gradient">ARENA</span>
      </span>
    </div>
  );
}

/** Original-Wappenlogo (public/logo.webp). */
export function LogoMark({ size = 56, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/logo.webp"
      alt="Bavaria Autoarena Wappen"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cn("shrink-0 rounded-lg border border-gold/40 object-cover", className)}
    />
  );
}

/** Header-Variante: Bild + Wortmarke; unter 380px nur das Bild. */
export function HeaderLogo() {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark size={44} className="md:hidden" />
      <LogoMark size={56} className="hidden md:block" />
      <Logo className="max-[379px]:hidden xl:max-2xl:hidden" />
    </span>
  );
}
