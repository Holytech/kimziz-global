"use client";
import { CarFront, Search } from "lucide-react";
import { Listing, Site } from "@/lib/model";
import { VehicleCard } from "../common/vehicle-card";
import { Enquiry } from "@/components/shell";
import { Dropdown } from "@/components/dropdown";
import { useCarsFilter } from "@/hooks";

export interface CatalogueProps {
  site: Site;
  listings: Listing[];
}

export function Catalogue({ site, listings }: Readonly<CatalogueProps>) {
  const {
    query,
    setQuery,
    brand,
    setBrand,
    status,
    setStatus,
    sort,
    setSort,
    setPriceLimit,
    resetPrice,
    brands,
    minPrice,
    maxPrice,
    sliderMax,
    step,
    currentPrice,
    isPriceFiltered,
    formatPrice,
    filtered,
    filterSummary,
  } = useCarsFilter(listings);

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
        <Dropdown
          label="Brand"
          labelSrOnly
          className="min-w-32.5 flex-1 sm:flex-none"
          value={brand}
          onChange={setBrand}
          options={[
            { value: "", label: "All brands" },
            ...brands.map((m) => ({ value: m, label: m })),
          ]}
        />
        {maxPrice > 0 && (
          <div className="flex flex-col justify-center bg-surface border border-line rounded px-3.5 py-1.5 flex-1 min-w-[220px] sm:min-w-[240px] min-h-[46px] focus-within:ring-2 focus-within:ring-gold/50">
            <div className="flex items-center justify-between text-xs text-muted mb-1 gap-2">
              <label
                htmlFor="price-range-filter"
                className="font-medium text-ink shrink-0 cursor-pointer"
              >
                Max price
              </label>
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-semibold text-ink truncate">
                  {isPriceFiltered
                    ? `Up to ${formatPrice(currentPrice)}`
                    : "All prices"}
                </span>
                {isPriceFiltered && (
                  <button
                    type="button"
                    onClick={resetPrice}
                    className="text-[11px] text-muted hover:text-gold transition-colors cursor-pointer shrink-0 underline ml-0.5"
                    aria-label="Reset price filter"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            <input
              id="price-range-filter"
              type="range"
              min={minPrice}
              max={sliderMax}
              step={step}
              value={currentPrice}
              onChange={(e) => setPriceLimit(Number(e.target.value))}
              aria-valuemin={minPrice}
              aria-valuemax={sliderMax}
              aria-valuenow={currentPrice}
              aria-valuetext={
                isPriceFiltered
                  ? `Up to ${formatPrice(currentPrice)}`
                  : "All prices"
              }
              className="w-full accent-gold cursor-pointer h-5"
            />
          </div>
        )}
        <Dropdown
          label="Availability"
          labelSrOnly
          className="min-w-[130px] flex-1 sm:flex-none"
          value={status}
          onChange={setStatus}
          options={[
            { value: "", label: "All status" },
            { value: "available", label: "Available" },
            { value: "reserved", label: "Reserved" },
            { value: "sold", label: "Sold" },
          ]}
        />
        <Dropdown
          label="Sort by"
          labelSrOnly
          className="min-w-[130px] flex-1 sm:flex-none"
          value={sort}
          onChange={setSort}
          options={[
            { value: "featured", label: "Featured first" },
            { value: "newest", label: "Newest first" },
            { value: "price", label: "Lowest price" },
          ]}
        />
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
            message={`Hello ${site.name}, I am looking for a vehicle matching: ${filterSummary || "my specifications"}.`}
            className="sm:ml-auto shrink-0 inline-flex items-center justify-center gap-4 min-h-[50px] px-6 py-3 bg-gold text-navy border border-gold rounded-[3px] text-sm font-semibold whitespace-nowrap hover:bg-gold-hover hover:border-gold-hover transition-colors cursor-pointer"
          >
            Ask about sourcing
          </Enquiry>
        </div>
      )}
    </>
  );
}
