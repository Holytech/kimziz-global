import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Listing, Site } from "@/lib/model";
import { VehicleCard } from "../common/vehicle-card";
import { CarInvitation } from "./car-invitation";

export interface HomeVehiclesProps {
  site: Site;
  listings: Listing[];
}

export function HomeVehicles({ site, listings }: Readonly<HomeVehiclesProps>) {
  const hasFeatured = listings.some((v) => v.featured);
  const featuredVehicles = listings.filter((v) => v.featured).slice(0, 3);

  return (
    <section className="container py-16 md:py-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-9">
        <div>
          <span className="block text-[0.68rem] font-bold tracking-[0.19em] uppercase text-muted mb-2">
            KIMZIZ AUTOMOTIVE
          </span>
          <h2 className="text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[1.15] tracking-tight text-ink m-0">
            {site.carsTitle}
          </h2>
        </div>
        <Link
          className="inline-flex items-center gap-3 text-sm font-semibold text-ink hover:text-gold transition-colors min-h-[44px]"
          href="/cars"
        >
          Explore cars <ArrowRight size={18} />
        </Link>
      </div>
      {hasFeatured ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        <CarInvitation site={site} />
      )}
    </section>
  );
}
