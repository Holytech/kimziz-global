"use client";
import { useState } from "react";
import { CarFront, Search } from "lucide-react";
import { Listing, Site } from "@/lib/model";
import { VehicleCard } from "../common/vehicle-card";
import { Enquiry } from "@/components/shell";

export interface CatalogueProps {
  site: Site;
  listings: Listing[];
}

export function Catalogue({ site, listings }: Readonly<CatalogueProps>) {
  const [query, setQuery] = useState(""),
    [brand, setBrand] = useState(""),
    [status, setStatus] = useState(""),
    [sort, setSort] = useState("featured");
  const filtered = listings
    .filter(
      (v) =>
        (!brand || v.make === brand) &&
        (!status || v.availability === status) &&
        `${v.title} ${v.make} ${v.model} ${v.year}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "price"
        ? (a.price ?? Infinity) - (b.price ?? Infinity)
        : sort === "newest"
          ? b.year - a.year
          : Number(b.featured) - Number(a.featured) || a.order - b.order,
    );

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-8">
        <label className="flex items-center gap-2.5 bg-surface border border-line rounded px-3.5 flex-1 min-w-[220px] min-h-[46px] text-ink focus-within:ring-2 focus-within:ring-gold/50">
          <span className="sr-only">Search cars</span>
          <Search size={18} className="text-muted shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brand, model or year"
            className="border-0 bg-transparent text-sm w-full outline-none text-ink placeholder:text-muted"
          />
        </label>
        <label className="min-w-[130px] flex-1 sm:flex-none">
          <span className="sr-only">Brand</span>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full bg-surface text-ink border border-line rounded px-3.5 py-2.5 min-h-[46px] text-sm outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
          >
            <option value="">All brands</option>
            {[...new Set(listings.map((v) => v.make))].sort().map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-[130px] flex-1 sm:flex-none">
          <span className="sr-only">Availability</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-surface text-ink border border-line rounded px-3.5 py-2.5 min-h-[46px] text-sm outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
          >
            <option value="">All status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </label>
        <label className="min-w-[130px] flex-1 sm:flex-none">
          <span className="sr-only">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full bg-surface text-ink border border-line rounded px-3.5 py-2.5 min-h-[46px] text-sm outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
          >
            <option value="featured">Featured first</option>
            <option value="newest">Newest first</option>
            <option value="price">Lowest price</option>
          </select>
        </label>
      </div>

      {filtered.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-9 bg-surface border border-line p-7 md:p-10 rounded-[10px]">
          <CarFront
            size={64}
            strokeWidth={1}
            className="shrink-0 text-[#a17b3b]"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium tracking-tight text-ink mb-2">
              No matching cars found.
            </h3>
            <p className="text-sm text-muted max-w-[470px] m-0">
              Tell us what you are looking for. We can discuss sourcing options
              directly.
            </p>
          </div>
          <Enquiry
            site={site}
            message={`Hello ${site.name}, I am looking for a vehicle matching: ${query || brand || "my specifications"}.`}
            className="sm:ml-auto shrink-0 inline-flex items-center justify-center gap-4 min-h-[50px] px-6 py-3 bg-gold text-navy border border-gold rounded-[3px] text-sm font-semibold whitespace-nowrap hover:bg-gold-hover hover:border-gold-hover transition-colors cursor-pointer"
          >
            Ask about sourcing
          </Enquiry>
        </div>
      )}
    </>
  );
}
