import { cn } from "@/lib/utils";

export function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 12" width="56" height="12" aria-hidden="true" className={cn("mt-5 text-gold-500", className)}>
      <path d="M1 6 7 1l6 5-6 5Z" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="m21 6 7-5 7 5-7 5Z" fill="currentColor" />
      <path d="m43 6 6-5 6 5-6 5Z" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}