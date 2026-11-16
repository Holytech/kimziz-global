import Link from "next/link";
import { ArrowUpRight, CarFront } from "lucide-react";
import { Listing, priceLabel } from "@/lib/model";
import { AvailabilityBadge } from "./availability-badge";

export interface VehicleCardProps {
  vehicle: Listing;
}

export function VehicleCard({ vehicle: v }: Readonly<VehicleCardProps>) {
  return (
    <Link
      href={`/cars/${v.id}`}
      className="block bg-surface border border-line hover:border-gold transition-colors rounded-[5px] overflow-hidden group"
    >
      <div className="h-[230px] relative bg-soft grid place-items-center overflow-hidden">
        {v.images[0] ? (
          <img
            src={v.images[0].url}
            alt={v.images[0].alt || v.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <CarFront size={64} strokeWidth={1} className="text-[#a17b3b]" />
        )}
        <AvailabilityBadge
          availability={v.availability}
          className="absolute top-3.5 left-3.5"
        />
      </div>
      <div className="p-6">
        <span className="block text-[0.65rem] font-bold tracking-[0.15em] uppercase text-muted mb-2">
          {v.year} · {v.condition}
        </span>
        <h3 className="text-lg font-medium tracking-tight text-ink mb-1 truncate">
          {v.title}
        </h3>
        <p className="text-xs text-muted mb-4">
          {v.transmission} ·{" "}
          {v.mileage === null
            ? "Mileage on request"
            : `${v.mileage.toLocaleString()} ${v.mileageUnit}`}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-line text-sm font-semibold text-ink">
          <strong>{priceLabel(v)}</strong>
          <ArrowUpRight
            size={20}
            className="text-muted group-hover:text-ink transition-colors"
          />
        </div>
      </div>
    </Link>
  );
}
