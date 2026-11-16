import { test } from "node:test";
import assert from "node:assert/strict";
import {
  siteMetadata,
  rootMetadata,
  defaultViewport,
  buildDynamicMetadata,
  buildVehicleMetadata,
  buildJsonLd,
  siteUrl,
} from "../src/lib/seo";
import { defaultSite } from "../src/lib/defaults";
import { emptyVehicle } from "../src/lib/model";
import robots from "../src/app/robots";

test("SEO baseline metadata contains all requested fields", () => {
  assert.ok(siteMetadata.title.includes("Kimziz Global"));
  assert.ok(siteMetadata.description.length > 20);
  assert.ok(
    Array.isArray(siteMetadata.keywords) && siteMetadata.keywords.length > 5,
  );

  // openGraph fields
  assert.equal(typeof siteMetadata.openGraph.title, "string");
  assert.equal(typeof siteMetadata.openGraph.description, "string");
  assert.equal(Array.isArray(siteMetadata.openGraph.images), true);
  assert.equal(siteMetadata.openGraph.images.length >= 2, true);
  assert.equal(siteMetadata.openGraph.siteName, "Kimziz Global Links Ltd.");
  assert.equal(siteMetadata.openGraph.locale, "en_US");
  assert.equal(siteMetadata.openGraph.type, "website");
  assert.equal(siteMetadata.openGraph.url, siteUrl);

  // canonical & theme
  assert.equal(siteMetadata.canonical, siteUrl);
  assert.equal(siteMetadata.themeColor, "#0c2035");
  assert.equal(defaultViewport.themeColor, "#0c2035");

  // language & locale
  assert.equal(siteMetadata.lang, "en");
  assert.equal(siteMetadata.langDir, "ltr");
  assert.equal(siteMetadata.locale, "en_US");

  // robots
  assert.equal(typeof siteMetadata.robots.index, "boolean");
  assert.equal(typeof siteMetadata.robots.follow, "boolean");
  assert.equal(siteMetadata.robots.googleBot.image, true);

  // twitter
  assert.equal(siteMetadata.twitter.card, "summary_large_image");
  assert.ok(siteMetadata.twitter.title.includes("Kimziz Global"));
  assert.equal(siteMetadata.twitter.images.length >= 2, true);
  assert.equal(siteMetadata.twitter.type, "website");
  assert.equal(siteMetadata.twitter.url, siteUrl);
});

test("Root metadata is properly formatted for Next.js App Router", () => {
  assert.ok(rootMetadata.metadataBase instanceof URL);
  assert.equal(rootMetadata.alternates?.canonical, siteUrl);
  assert.ok(rootMetadata.openGraph?.images);
  assert.ok(rootMetadata.twitter?.images);
});

test("Dynamic metadata properly incorporates custom site data", () => {
  const dynamicMeta = buildDynamicMetadata({
    ...defaultSite,
    seoTitle: "Custom Title for Kimziz",
    seoDescription: "Custom Description for Kimziz",
    socialImage: "https://res.cloudinary.com/example/image/upload/og.jpg",
  });

  assert.deepEqual(dynamicMeta.title, {
    default: "Custom Title for Kimziz",
    template: "%s | Kimziz Global Links Ltd.",
  });
  assert.equal(dynamicMeta.description, "Custom Description for Kimziz");
});

test("Vehicle metadata generates search-friendly tags for single car pages", () => {
  const vehicle = {
    ...emptyVehicle,
    title: "2022 Toyota Camry XSE",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    condition: "Foreign used" as const,
    price: 32000000,
    currency: "NGN" as const,
    location: "Apapa, Lagos",
    description: "Mint condition foreign used Camry.",
    images: [{ url: "https://example.com/camry.jpg", alt: "Camry" }],
  };

  const meta = buildVehicleMetadata(vehicle, "camry-123", defaultSite);
  assert.equal(meta.title, "2022 Toyota Camry XSE (Foreign used)");
  assert.equal(meta.alternates?.canonical, `${siteUrl}/cars/camry-123`);
  assert.equal(
    meta.openGraph?.title,
    "2022 Toyota Camry XSE (Foreign used) | Kimziz Global Links Ltd.",
  );
});

test("JSON-LD structured data formats valid Organization and WebSite schema", () => {
  const jsonLd = buildJsonLd(defaultSite);
  assert.equal(jsonLd["@context"], "https://schema.org");
  assert.equal(jsonLd["@graph"].length, 2);

  const website = jsonLd["@graph"][0];
  assert.equal(website["@type"], "WebSite");
  assert.equal(website.url, siteUrl);

  const org = jsonLd["@graph"][1];
  assert.deepEqual(org["@type"], [
    "Organization",
    "LocalBusiness",
    "AutoDealer",
  ]);
  assert.equal(org.identifier, "RC 1922809");
});

test("Robots generates correct crawler rules and host", () => {
  const robotRules = robots();
  assert.ok(robotRules.rules);
  assert.equal(robotRules.host, siteUrl);
  assert.equal(robotRules.sitemap, `${siteUrl}/sitemap.xml`);
});
