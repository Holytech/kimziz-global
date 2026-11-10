"use client";
import { useState } from "react";
import { CarFront, Search } from "lucide-react";
import { Listing, Site } from "@/lib/model";
import { VehicleCard } from "./public-content";
import { Enquiry } from "./shell";
export function Catalogue({
  site,
  listings,
}: {
  site: Site;
  listings: Listing[];
}) {
  const [query, setQuery] = useState(""),
    [make, setMake] = useState(""),
    [status, setStatus] = useState(""),
    [sort, setSort] = useState("featured");
  const filtered = listings
    .filter(
      (v) =>
        (!make || v.make === make) &&
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
      <div className="filters">
        <label className="search-field">
          <span className="sr-only">Search cars</span>
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search make, model or year"
          />
        </label>
        <label>
          <span className="sr-only">Make</span>
          <select value={make} onChange={(e) => setMake(e.target.value)}>
            <option value="">All makes</option>
            {[...new Set(listings.map((v) => v.make))].sort().map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Availability</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All availability</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Sort vehicles</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured first</option>
            <option value="newest">Newest year</option>
            <option value="price">Price: low to high</option>
          </select>
        </label>
      </div>
      <p className="small muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "vehicle" : "vehicles"}
      </p>
      {filtered.length ? (
        <div className="vehicle-grid">
          {filtered.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <CarFront size={68} strokeWidth={1} />
          <h2>
            {listings.length
              ? "No matching vehicles"
              : "Your next car is worth a conversation."}
          </h2>
          <p>
            {listings.length
              ? "Try a different search or clear your filters."
              : "We’re preparing our online selection. Tell us what you’re looking for and ask about current availability."}
          </p>
          {listings.length ? (
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setMake("");
                setStatus("");
              }}
            >
              Clear filters
            </button>
          ) : (
            <Enquiry
              site={site}
              message={`Hello ${site.name}, I would like to discuss available cars. My preferences and budget are: `}
            >
              Discuss a car
            </Enquiry>
          )}
        </div>
      )}
    </>
  );
}
