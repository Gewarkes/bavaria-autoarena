import type { ImgHTMLAttributes } from "react";
import { useVehicleImage } from "@/lib/vehicleImages";

export function VehicleImg({ src, ...rest }: Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string | undefined }) {
  const resolved = useVehicleImage(src);
  if (!resolved) return <div className={rest.className} aria-hidden="true" />;
  return <img src={resolved} {...rest} />;
}
