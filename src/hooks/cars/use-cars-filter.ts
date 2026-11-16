import { useCallback, useMemo, useState } from "react";
import { Listing } from "@/lib/model";

export const MIN_PRICE = 3_000_000;
export const DEFAULT_MAX_PRICE = 300_000_000;
export const STEP = 500_000;

export function useCarsFilter(listings: Listing[]) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("featured");
  const [priceLimit, setPriceLimit] = useState<number | null>(null);

  const currency = useMemo(
    () => listings.find((v) => v.currency)?.currency ?? "NGN",
    [listings],
  );

  const brands = useMemo(
    () =>
      [...new Set(listings.map((v) => v.make))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [listings],
  );

  const { maxPrice, sliderMax, step } = useMemo(() => {
    const prices = listings
      .map((v) => v.price)
      .filter((p): p is number => typeof p === "number" && p > 0);
    const max = prices.length ? Math.max(...prices) : 0;
    if (max <= 0) return { maxPrice: 0, sliderMax: 0, step: STEP };

    const roundedMax = Math.max(
      DEFAULT_MAX_PRICE,
      Math.ceil(max / STEP) * STEP,
    );

    return { maxPrice: max, sliderMax: roundedMax, step: STEP };
  }, [listings]);

  const currentPrice = priceLimit ?? sliderMax;
  const isPriceFiltered = priceLimit !== null && priceLimit < sliderMax;

  const formatPrice = useCallback(
    (amount: number) =>
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(amount),
    [currency],
  );

  const resetPrice = useCallback(() => {
    setPriceLimit(null);
  }, []);

  const filtered = useMemo(
    () =>
      listings
        .filter(
          (v) =>
            (!brand || v.make === brand) &&
            (!status || v.availability === status) &&
            (!isPriceFiltered ||
              (v.price !== null && v.price <= currentPrice)) &&
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
        ),
    [brand, currentPrice, isPriceFiltered, listings, query, sort, status],
  );

  const filterSummary = useMemo(
    () =>
      [
        query,
        brand,
        isPriceFiltered ? `budget up to ${formatPrice(currentPrice)}` : "",
      ]
        .filter(Boolean)
        .join(", "),
    [brand, currentPrice, formatPrice, isPriceFiltered, query],
  );

  return {
    query,
    setQuery,
    brand,
    setBrand,
    status,
    setStatus,
    sort,
    setSort,
    priceLimit,
    setPriceLimit,
    resetPrice,
    brands,
    minPrice: MIN_PRICE,
    maxPrice,
    sliderMax,
    step,
    currentPrice,
    isPriceFiltered,
    formatPrice,
    filtered,
    filterSummary,
  };
}

export const useCatalogue = useCarsFilter;
