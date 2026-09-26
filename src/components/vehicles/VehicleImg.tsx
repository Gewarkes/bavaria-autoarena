import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { useVehicleImage } from "@/lib/vehicleImages";
import { cn } from "@/lib/utils";

export function VehicleImg({ src, className, onError, ...rest }: Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string | undefined }) {
  const resolved = useVehicleImage(src);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [resolved]);

  if (!resolved || failed) return <div className={cn(className, "flex items-center justify-center bg-navy-900")} role="img" aria-label="Fotos folgen"><span className="flex flex-col items-center gap-3"><i className="size-5 rotate-45 border border-gold-500" /><span className="font-display text-[11px] font-normal uppercase tracking-[.16em] text-silver-300">Fotos folgen</span></span></div>;
  return <img src={resolved} className={className} onError={(event) => { setFailed(true); onError?.(event); }} {...rest} />;
}
