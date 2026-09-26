import useEmblaCarousel from "embla-carousel-react";
import { VehicleImg } from "./VehicleImg";
import { ChevronLeft, ChevronRight, Expand, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { VehicleImage } from "@/lib/vehicles";
import { cn } from "@/lib/utils";

export function VehicleGallery({ images, title, badge }: { images: VehicleImage[]; title: string; badge?: React.ReactNode }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: images.length > 1, active: images.length > 1 });
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  useEffect(() => { if (!embla) return; const on = () => setIndex(embla.selectedScrollSnap()); embla.on("select", on); return () => { embla.off("select", on); }; }, [embla]);
  const go = useCallback((d: number) => embla?.scrollTo((index + d + images.length) % images.length), [embla, index, images.length]);
  const multi = images.length > 1;
  const current = images[index];

  if (!images.length) return <div className="aspect-16/10 rounded-lg border border-border bg-muted" />;
  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-border bg-darkest">
        <div ref={emblaRef} className="overflow-hidden"><div className="flex">
          {images.map((img, i) => <button key={img.url} type="button" onClick={() => setOpen(true)} className="relative aspect-16/10 min-w-0 flex-[0_0_100%] cursor-zoom-in" aria-label="Bild vergrößern"><VehicleImg src={img.url} alt={img.alt || title} width="1600" height="1000" loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : undefined} className="size-full object-cover" /></button>)}
        </div></div>
        {badge ? <div className="pointer-events-none absolute left-4 top-4">{badge}</div> : null}
        <span className="pointer-events-none absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-darkest/80 text-foreground"><Expand className="size-4" /></span>
        {multi ? <>
          <button type="button" onClick={() => go(-1)} aria-label="Vorheriges Bild" className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-darkest/80 text-foreground hover:text-gold"><ChevronLeft /></button>
          <button type="button" onClick={() => go(1)} aria-label="Nächstes Bild" className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-darkest/80 text-foreground hover:text-gold"><ChevronRight /></button>
        </> : null}
      </div>
      {multi ? <div className="mt-3 grid grid-cols-5 gap-2">{images.map((img, i) => <button key={img.url} type="button" onClick={() => embla?.scrollTo(i)} aria-label={`Bild ${i + 1}`} className={cn("aspect-4/3 overflow-hidden rounded-md border", i === index ? "border-gold" : "border-border opacity-70 hover:opacity-100")}><VehicleImg src={img.thumbUrl || img.url} alt="" width="200" height="150" loading="lazy" className="size-full object-cover" /></button>)}</div> : null}
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setZoom(false); }}>
        <DialogContent className="max-w-6xl border-border bg-darkest p-2">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className={cn("relative max-h-[80vh] overflow-auto", zoom ? "cursor-zoom-out" : "cursor-zoom-in")} onClick={() => setZoom((z) => !z)}>
            {current ? <VehicleImg src={current.url} alt={current.alt || title} width="1600" height="1000" className={cn("mx-auto transition-transform", zoom ? "max-w-none w-[200%]" : "w-full")} /> : null}
          </div>
          <div className="flex items-center justify-between p-2 text-sm text-muted-foreground">
            <span>{multi ? `${index + 1} / ${images.length}` : title}</span>
            <div className="flex gap-2">
              {multi ? <><button type="button" onClick={() => go(-1)} aria-label="Vorheriges Bild" className="grid size-10 place-items-center rounded-full border border-border"><ChevronLeft className="size-4" /></button><button type="button" onClick={() => go(1)} aria-label="Nächstes Bild" className="grid size-10 place-items-center rounded-full border border-border"><ChevronRight className="size-4" /></button></> : null}
              <button type="button" onClick={() => setZoom((z) => !z)} aria-label={zoom ? "Verkleinern" : "Vergrößern"} className="grid size-10 place-items-center rounded-full border border-border">{zoom ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
