import useEmblaCarousel from "embla-carousel-react";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { sizedImage } from "@/lib/vehicleImages";
import type { VehicleImage } from "@/lib/vehicles";
import { VehicleImg } from "./VehicleImg";

type GalleryImage = VehicleImage & { originalIndex: number };

export function VehicleGallery({ images, title, badge }: { images: GalleryImage[]; title: string; badge?: React.ReactNode; sealIndices?: number[] }) {
  const [mobileRef, mobileApi] = useEmblaCarousel({ loop: false });
  const [lightboxRef, lightboxApi] = useEmblaCarousel({ loop: true });
  const [mobileIndex, setMobileIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const openAt = useCallback((index: number) => {
    setLightboxIndex(index);
    setOpen(true);
    window.history.pushState({ vehicleLightbox: true }, "", `#foto-${index + 1}`);
    requestAnimationFrame(() => lightboxApi?.scrollTo(index, true));
  }, [lightboxApi]);

  const close = useCallback(() => {
    setOpen(false);
    if (window.location.hash.startsWith("#foto-")) window.history.back();
  }, []);

  useEffect(() => {
    if (!mobileApi) return;
    const select = () => setMobileIndex(mobileApi.selectedScrollSnap());
    mobileApi.on("select", select);
    return () => { mobileApi.off("select", select); };
  }, [mobileApi]);

  useEffect(() => {
    if (!lightboxApi) return;
    const select = () => {
      const next = lightboxApi.selectedScrollSnap();
      setLightboxIndex(next);
      if (open) window.history.replaceState({ vehicleLightbox: true }, "", `#foto-${next + 1}`);
    };
    lightboxApi.on("select", select);
    if (open) lightboxApi.scrollTo(lightboxIndex, true);
    return () => { lightboxApi.off("select", select); };
  }, [lightboxApi, lightboxIndex, open]);

  useEffect(() => {
    const pop = () => { if (!window.location.hash.startsWith("#foto-")) setOpen(false); };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === "ArrowLeft") lightboxApi?.scrollPrev();
      if (event.key === "ArrowRight") lightboxApi?.scrollNext();
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [close, lightboxApi, open]);

  if (!images.length) return <div className="aspect-[4/3] rounded-sm bg-ink-800 lg:aspect-[2/1]" />;
  const mosaic = images.slice(0, 5);
  const single = images.length === 1;

  return <>
    <div className="hidden aspect-[4/3] max-h-[720px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-sm bg-image-placeholder lg:grid">
      {mosaic.map((image, index) => <button key={image.url} type="button" onClick={() => openAt(index)} aria-label={`Foto ${index + 1} öffnen`} className={`relative min-h-0 overflow-hidden bg-image-placeholder ${index === 0 ? images.length === 1 ? "col-span-4 row-span-2" : "col-span-2 row-span-2" : ""}`}>
        <VehicleImg src={sizedImage(image.url, index === 0 ? "full" : "card")} alt={image.alt || `${title} – Foto ${index + 1}`} width={index === 0 ? 1600 : 640} height={index === 0 ? 1200 : 480} loading={index < 3 ? "eager" : "lazy"} fetchPriority={index < 3 ? "high" : undefined} className="size-full object-cover object-center transition-transform duration-500 motion-safe:[@media(hover:hover)]:hover:scale-[1.03]" />
        {index === mosaic.length - 1 && images.length > 5 ? <span className="absolute inset-0 grid place-items-center bg-ink-950/20"><span className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-ink-800 px-4 font-display text-xs font-medium uppercase tracking-[.12em] text-foreground"><Camera className="size-4" />Alle {images.length} Fotos</span></span> : null}
        {index === 0 && badge ? <span className="absolute left-4 top-4">{badge}</span> : null}
      </button>)}
    </div>

    <div className="-mx-5 lg:hidden">
      <div ref={mobileRef} className="overflow-hidden bg-image-placeholder"><div className="flex">
        {images.map((image, index) => <button key={image.url} type="button" onClick={() => openAt(index)} className="relative aspect-[4/3] min-w-0 flex-[0_0_100%] bg-image-placeholder" aria-label={`Foto ${index + 1} öffnen`}><VehicleImg src={sizedImage(image.url, index === 0 ? "full" : "card")} alt={image.alt || `${title} – Foto ${index + 1}`} width={1024} height={768} loading={index < 3 ? "eager" : "lazy"} fetchPriority={index < 3 ? "high" : undefined} className="size-full object-cover object-center" />{index === 0 && badge ? <span className="absolute left-3 top-3">{badge}</span> : null}</button>)}
      </div><span className="pointer-events-none absolute" /></div>
      {single ? null : <><span className="relative -mt-10 mr-3 ml-auto flex w-fit rounded-sm bg-ink-900/75 px-2.5 py-1 text-xs text-foreground">{mobileIndex + 1} / {images.length}</span>
      <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto px-5 pb-1">{images.map((image, index) => <button key={image.url} type="button" onClick={() => mobileApi?.scrollTo(index)} aria-label={`Foto ${index + 1}`} className={`h-14 w-[75px] shrink-0 overflow-hidden rounded-sm bg-image-placeholder ring-1 ${index === mobileIndex ? "ring-primary" : "ring-border"}`}><VehicleImg src={sizedImage(image.url, "card")} alt="" width={160} height={120} loading="lazy" className="size-full object-cover object-center" /></button>)}</div></>}
    </div>

    <Dialog open={open} onOpenChange={(next) => { if (!next) close(); }}>
      <DialogContent className="fixed inset-0 left-0 top-0 z-50 block size-full max-w-none translate-x-0 translate-y-0 border-0 bg-ink-950/97 p-0 text-foreground shadow-none data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 sm:rounded-none [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Fotogalerie: {title}</DialogTitle>
        {single ? null : <span className="absolute left-4 top-4 z-20 text-sm tabular-nums">{lightboxIndex + 1} / {images.length}</span>}
        <button type="button" onClick={close} aria-label="Galerie schließen" className="absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-sm bg-ink-900 text-foreground"><X /></button>
        {single ? null : <><button type="button" onClick={() => lightboxApi?.scrollPrev()} aria-label="Vorheriges Foto" className="absolute left-2 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center bg-ink-900/80 text-foreground md:grid"><ChevronLeft /></button>
        <button type="button" onClick={() => lightboxApi?.scrollNext()} aria-label="Nächstes Foto" className="absolute right-2 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center bg-ink-900/80 text-foreground md:grid"><ChevronRight /></button></>}
        <div ref={lightboxRef} onTouchStart={(event) => setTouchStartY(event.touches[0]?.clientY ?? null)} onTouchEnd={(event) => { const endY = event.changedTouches[0]?.clientY; if (touchStartY != null && endY != null && endY - touchStartY > 100) close(); setTouchStartY(null); }} className={single ? "h-[100dvh] overflow-hidden" : "h-[calc(100dvh-88px)] overflow-hidden"}><div className="flex h-full">{images.map((image, index) => <div key={image.url} className="flex min-w-0 flex-[0_0_100%] items-center justify-center p-3 pt-16 md:p-16"><VehicleImg src={sizedImage(image.url, "full")} alt={image.alt || `${title} – Foto ${index + 1}`} width={1600} height={1200} loading={Math.abs(index - lightboxIndex) <= 1 ? "eager" : "lazy"} className="size-full object-contain" /></div>)}</div></div>
        {single ? null : <div className="hide-scrollbar flex h-[88px] gap-2 overflow-x-auto border-t border-foreground/10 bg-ink-950 px-3 py-3">{images.map((image, index) => <button key={image.url} type="button" onClick={() => lightboxApi?.scrollTo(index)} aria-label={`Foto ${index + 1}`} className={`h-16 aspect-[4/3] shrink-0 overflow-hidden rounded-sm ring-1 ${index === lightboxIndex ? "ring-primary" : "ring-foreground/20"}`}><VehicleImg src={sizedImage(image.url, "card")} alt="" width={160} height={120} loading="lazy" className="size-full object-cover object-center" /></button>)}</div>}
      </DialogContent>
    </Dialog>
  </>;
}