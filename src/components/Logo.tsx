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