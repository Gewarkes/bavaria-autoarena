import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return <LogoMark size={96} {...(className ? { className } : {})} />;
}

/** Original-Wappenlogo (public/logo.webp). */
export function LogoMark({ size = 56, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/logo.webp"
      alt="Bavaria Autoarena Wappen"
      width={size}
      height={size}
      className={cn("aspect-square shrink-0 object-cover [clip-path:circle(48%)]", className)}
    />
  );
}

/** Header-Variante: Bild + Wortmarke; unter 380px nur das Bild. */
export function HeaderLogo() {
  return <LogoMark size={56} className="size-10 md:size-14" />;
}
