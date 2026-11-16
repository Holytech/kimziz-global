import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Catalogue } from "../src/components/public/cars/catalogue";
import {
  useCarsFilter,
  MIN_PRICE,
  DEFAULT_MAX_PRICE,
  STEP,
} from "../src/hooks";
import { defaultSite } from "../src/lib/defaults";
import { emptyVehicle, Listing } from "../src/lib/model";

const sampleListings: Listing[] = [
  {
    ...emptyVehicle,
    id: "car-1",
    title: "Toyota Camry",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 32000000,
    currency: "NGN",
    availability: "available",
  },
  {
    ...emptyVehicle,
    id: "car-2",
    title: "Honda Accord",
    make: "Honda",
    model: "Accord",
    year: 2021,
    price: 24000000,
    currency: "NGN",
    availability: "available",
  },
  {
    ...emptyVehicle,
    id: "car-3",
    title: "Mercedes-Benz C300",
    make: "Mercedes-Benz",
    model: "C300",
    year: 2023,
    price: null,
    currency: "NGN",
    availability: "available",
  },
];

test("Catalogue renders price range slider when priced listings exist", () => {
  const html = renderToStaticMarkup(
    React.createElement(Catalogue, {
      site: defaultSite,
      listings: sampleListings,
    }),
  );

  assert.ok(html.includes('type="range"'), "Should contain range input");
  assert.ok(
    html.includes('id="price-range-filter"'),
    "Should have price-range-filter id",
  );
  assert.ok(html.includes("Max price"), "Should display Max price label");
  assert.ok(html.includes("All prices"), "Should show All prices initially");
  assert.ok(html.includes(`min="${MIN_PRICE}"`), `Min should be ${MIN_PRICE}`);
  assert.ok(
    html.includes(`max="${DEFAULT_MAX_PRICE}"`),
    `Max should be ${DEFAULT_MAX_PRICE}`,
  );
  assert.ok(html.includes(`step="${STEP}"`), `Step should be ${STEP}`);
});

test("Catalogue omits price range slider when no listings have numeric price", () => {
  const unpricedListings: Listing[] = [
    {
      ...emptyVehicle,
      id: "car-1",
      title: "Toyota Camry",
      make: "Toyota",
      price: null,
    },
  ];

  const html = renderToStaticMarkup(
    React.createElement(Catalogue, {
      site: defaultSite,
      listings: unpricedListings,
    }),
  );

  assert.ok(
    !html.includes('type="range"'),
    "Should not render range slider when all prices are null",
  );
});

test("useCarsFilter extracts brands, computes price bounds, and formats prices", () => {
  let hookResult: ReturnType<typeof useCarsFilter> | null = null;
  function TestComponent() {
    hookResult = useCarsFilter(sampleListings);
    return null;
  }
  renderToStaticMarkup(React.createElement(TestComponent));

  if (!hookResult) {
    throw new Error("Expected hookResult to be populated");
  }
  const res = hookResult as ReturnType<typeof useCarsFilter>;
  assert.deepEqual(res.brands, ["Honda", "Mercedes-Benz", "Toyota"]);
  assert.equal(res.minPrice, MIN_PRICE);
  assert.equal(res.sliderMax, DEFAULT_MAX_PRICE);
  assert.equal(res.maxPrice, 32_000_000);
  assert.equal(res.step, STEP);
  assert.equal(res.isPriceFiltered, false);
  assert.equal(res.filtered.length, 3);
});
