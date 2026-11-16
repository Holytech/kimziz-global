import Link from "next/link";
import { Listing, Site, priceLabel } from "@/lib/model";
import { Enquiry } from "@/components/shell";
import { AvailabilityBadge } from "../common/availability-badge";
import { VehicleGallery } from "./vehicle-gallery";
import { VehicleSpecs } from "./vehicle-specs";

export interface VehicleDetailProps {
  site: Site;
  vehicle: Listing;
}

export function VehicleDetail({
  site,
  vehicle: v,
}: Readonly<VehicleDetailProps>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const listingUrl = siteUrl ? `${siteUrl}/cars/${v.id}` : `/cars/${v.id}`;
  const enquiryMessage = `Hello ${site.name}, I would like to enquire about ${v.title} (${v.year}). \nReference: ${v.id}. \nStatus: ${v.availability}. \n${listingUrl}`;

  return (
    <section className="container py-8 md:py-14">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-gold transition-colors mb-6"
        href="/cars"
      >
        ← All cars
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-14 items-start">
        {/* Left Column: Gallery & Assets (sticks if shorter, comes after details on mobile) */}
        <div className="order-2 lg:order-1 min-w-0 lg:sticky lg:top-24">
          <VehicleGallery images={v.images} video={v.video} title={v.title} />
        </div>

        {/* Right Column: Details (sticks if shorter, comes FIRST on mobile) */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24">
          <AvailabilityBadge availability={v.availability} />
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-ink mt-4 mb-2">
            {v.title}
          </h1>
          <p className="text-2xl font-semibold text-ink mb-6">
            {priceLabel(v)}
          </p>
          <VehicleSpecs vehicle={v} />
          <p className="text-sm md:text-base text-muted leading-relaxed mb-4">
            {v.description}
          </p>
          {v.features && (
            <p className="text-sm text-muted leading-relaxed whitespace-pre-line mb-6">
              {v.features}
            </p>
          )}
          <Enquiry site={site} message={enquiryMessage}>
            {v.availability === "available"
              ? "Enquire about this car"
              : "Ask about similar cars"}
          </Enquiry>
          <p className="text-xs text-muted mt-4">
            Confirm availability and details directly. No payment is taken on
            this website.
          </p>
        </div>
      </div>
    </section>
  );
}
