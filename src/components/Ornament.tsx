import { cn } from "@/lib/utils";

/** Feine Akzentlinie im Marken-Verlauf. */
export function Ornament({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("brand-line mt-6 block h-px w-14", className)} />;
}
