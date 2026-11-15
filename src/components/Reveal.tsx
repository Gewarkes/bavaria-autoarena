import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Sanftes Einblenden. Ohne JavaScript, beim ersten Rendern und für alles, was
 * beim Laden schon im Sichtbereich liegt, bleibt der Inhalt sichtbar. Versteckt
 * wird nur, was noch unterhalb liegt – und es erscheint, bevor es den Rand erreicht.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "waiting" | "shown">("static");

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;
    setState("waiting");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting || (entry && entry.boundingClientRect.top < 0)) {
        setState("shown");
        observer.disconnect();
      }
    }, { rootMargin: "0px 0px 15% 0px", threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={cn(state !== "static" && "reveal", state === "shown" && "reveal-visible", className)}>{children}</div>;
}
