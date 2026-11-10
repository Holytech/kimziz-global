"use client";
import Link from "next/link";
import { useState } from "react";
import { Listing, priceLabel } from "@/lib/model";
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
      <div className="filters">
        <label className="search-field">
          <span className="sr-only">Search inventory</span>
          <input
            placeholder="Search inventory"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Publication status"
          value={publication}
          onChange={(e) => setPublication(e.target.value)}
        >
          <option value="">All publication states</option>
          <option value="published">Published</option>
          <option value="draft">Draft / archived</option>
        </select>
        <select
          aria-label="Availability"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All availability</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
      </div>
      <div className="table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Publication</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id}>
                <td>
                  {v.title}
                  <br />
                  <span className="small muted">
                    {v.year} · {v.make}
                  </span>
                </td>
                <td>{priceLabel(v)}</td>
                <td>
                  <span className={`badge ${v.availability}`}>
                    {v.availability}
                  </span>
                </td>
                <td>{v.published ? "Published" : "Draft / archived"}</td>
                <td>
                  <Link href={`/admin/inventory/${v.id}`}>
                    Edit<span className="sr-only"> {v.title}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <h2>No vehicles here yet.</h2>
          <p>
            Add a vehicle or change your filters. Drafts stay private until you
            publish them.
          </p>
        </div>
      )}
    </>
  );
}
