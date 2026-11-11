"use client";
import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { Listing, priceLabel } from "@/lib/model";
import { AvailabilityBadge } from "./public/common/availability-badge";

export function InventoryTable({
  rows,
}: {
  rows: (Listing & { published: boolean })[];
}) {
  const [query, setQuery] = useState(""),
    [publication, setPublication] = useState(""),
    [status, setStatus] = useState("");
  const filtered = rows.filter(
    (v) =>
      v.title.toLowerCase().includes(query.toLowerCase()) &&
      (!publication || (publication === "published") === v.published) &&
      (!status || v.availability === status),
  );

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <label className="flex items-center gap-2.5 bg-surface border border-line rounded px-3.5 flex-1 min-w-[220px] min-h-[46px] text-ink focus-within:ring-2 focus-within:ring-gold/50">
          <span className="sr-only">Search inventory</span>
          <Search size={18} className="text-muted shrink-0" />
          <input
            placeholder="Search inventory"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent text-sm w-full outline-none text-ink placeholder:text-muted"
          />
        </label>
        <select
          aria-label="Publication status"
          value={publication}
          onChange={(e) => setPublication(e.target.value)}
          className="bg-surface text-ink border border-line rounded px-3.5 py-2.5 min-h-[46px] text-sm outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
        >
          <option value="">All publication states</option>
          <option value="published">Published</option>
          <option value="draft">Draft / archived</option>
        </select>
        <select
          aria-label="Availability"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-surface text-ink border border-line rounded px-3.5 py-2.5 min-h-[46px] text-sm outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
        >
          <option value="">All availability</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
      </div>
      <div className="overflow-x-auto border border-line rounded-[5px] bg-surface">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-soft/50">
              <th className="px-4 py-3 text-[0.68rem] tracking-wider uppercase text-muted font-semibold border-b border-line">
                Vehicle
              </th>
              <th className="px-4 py-3 text-[0.68rem] tracking-wider uppercase text-muted font-semibold border-b border-line">
                Price
              </th>
              <th className="px-4 py-3 text-[0.68rem] tracking-wider uppercase text-muted font-semibold border-b border-line">
                Availability
              </th>
              <th className="px-4 py-3 text-[0.68rem] tracking-wider uppercase text-muted font-semibold border-b border-line">
                Publication
              </th>
              <th className="px-4 py-3 text-[0.68rem] tracking-wider uppercase text-muted font-semibold border-b border-line">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-soft/30 transition-colors">
                <td className="px-4 py-3.5 border-b border-line text-ink">
                  <span className="font-medium">{v.title}</span>
                  <br />
                  <span className="text-xs text-muted">
                    {v.year} · {v.make}
                  </span>
                </td>
                <td className="px-4 py-3.5 border-b border-line text-ink font-semibold">
                  {priceLabel(v)}
                </td>
                <td className="px-4 py-3.5 border-b border-line text-ink">
                  <AvailabilityBadge availability={v.availability} />
                </td>
                <td className="px-4 py-3.5 border-b border-line text-ink text-xs">
                  {v.published ? (
                    <span className="text-green-700 dark:text-green-400 font-medium">
                      Published
                    </span>
                  ) : (
                    <span className="text-muted">Draft / archived</span>
                  )}
                </td>
                <td className="px-4 py-3.5 border-b border-line text-ink">
                  <Link
                    href={`/admin/inventory/${v.id}`}
                    className="font-semibold underline underline-offset-4 hover:text-gold transition-colors"
                  >
                    Edit<span className="sr-only"> {v.title}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && (
        <div className="flex flex-col items-center text-center p-12 bg-soft border border-line rounded-[8px] mt-6">
          <h2 className="text-xl font-medium tracking-tight text-ink mb-2">
            No vehicles here yet.
          </h2>
          <p className="text-sm text-muted max-w-[500px]">
            Add a vehicle or change your filters. Drafts stay private until you
            publish them.
          </p>
        </div>
      )}
    </>
  );
}
