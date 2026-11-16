import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Dropdown } from "../src/components/dropdown";

test("Dropdown renders with visible label and string options", () => {
  const html = renderToStaticMarkup(
    React.createElement(Dropdown, {
      label: "Transmission",
      value: "Automatic",
      options: ["Automatic", "Manual"],
    }),
  );

  assert.ok(html.includes("Transmission"), "Should include label text");
  assert.ok(
    !html.includes("sr-only"),
    "Visible label should not have sr-only class",
  );
  assert.ok(html.includes('value="Automatic"'), "Should have Automatic option");
  assert.ok(html.includes('value="Manual"'), "Should have Manual option");
  assert.ok(html.includes("svg"), "Should include chevron icon svg");
});

test("Dropdown renders with sr-only label when labelSrOnly is true", () => {
  const html = renderToStaticMarkup(
    React.createElement(Dropdown, {
      label: "Brand Filter",
      labelSrOnly: true,
      value: "Toyota",
      options: [
        { value: "", label: "All brands" },
        { value: "Toyota", label: "Toyota" },
        { value: "Honda", label: "Honda", disabled: true },
      ],
    }),
  );

  assert.ok(html.includes("sr-only"), "Should have sr-only class for label");
  assert.ok(html.includes("Brand Filter"), "Should include label text");
  assert.ok(
    html.includes('aria-label="Brand Filter"'),
    "Should have aria-label",
  );
  assert.ok(html.includes("All brands"), "Should render object option label");
  assert.ok(html.includes("disabled"), "Should support disabled options");
});

test("Dropdown renders custom children options when provided", () => {
  const html = renderToStaticMarkup(
    React.createElement(
      Dropdown,
      { label: "Custom", labelSrOnly: true, value: "1" },
      React.createElement("option", { value: "1" }, "First"),
      React.createElement("option", { value: "2" }, "Second"),
    ),
  );

  assert.ok(html.includes('value="1"'), "Should render first child option");
  assert.ok(html.includes("First"), "Should render first label");
  assert.ok(html.includes('value="2"'), "Should render second child option");
  assert.ok(html.includes("Second"), "Should render second label");
});
