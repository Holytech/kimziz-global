import type { Metadata, Viewport } from "next";
import type { Site, Vehicle } from "./model";
import { priceLabel } from "./model";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kimzizglobal.com";

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false";

/**
 * Baseline metadata matching the comprehensive specification provided.
 */
export const siteMetadata = {
  title: "Kimziz Global Links Ltd. | Importation, Exportation & Car Dealings",
  description:
    "Join Kimziz Global Links Ltd. in Apapa, Lagos for reliable importation, exportation, shipping logistics, and quality automobile dealings.",
  keywords: [
    "Kimziz Global Links",
    "Kimziz Global Links Ltd",
    "Importation and Exportation Nigeria",
    "Car Dealings Lagos",
    "Automobile Dealership Apapa",
    "Buy Cars in Lagos",
    "Foreign Used Cars Nigeria",
    "Tokunbo Cars Lagos",
    "Shipping and Logistics Lagos",
    "Eleganza Plaza Apapa",
    "Import Cargo Nigeria",
    "Export Commodities Nigeria",
    "Freight Forwarding Apapa",
    "Vehicle Enquiries",
    "RC 1922809",
  ],
  openGraph: {
    title: "Kimziz Global Links Ltd. | Importation, Exportation & Car Dealings",
    description:
      "Join Kimziz Global Links Ltd. in Apapa, Lagos for reliable importation, exportation, shipping logistics, and quality automobile dealings.",
    images: [`${siteUrl}/opengraph-image`, `${siteUrl}/brand/kimziz-logo.png`],
    siteName: "Kimziz Global Links Ltd.",
    locale: "en_US",
    type: "website",
    url: siteUrl,
  },
  canonical: siteUrl,
  themeColor: "#0c2035",
  lang: "en",
  langDir: "ltr",
  locale: "en_US",
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
    googleBot: {
      index: allowIndexing,
      follow: allowIndexing,
      image: true,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Kimziz Global Links Ltd. | Importation, Exportation & Car Dealings",
    description:
      "Join Kimziz Global Links Ltd. in Apapa, Lagos for reliable importation, exportation, shipping logistics, and quality automobile dealings.",
    images: [`${siteUrl}/opengraph-image`, `${siteUrl}/brand/kimziz-logo.png`],
    type: "website",
    url: siteUrl,
  },
};

export const defaultViewport: Viewport = {
  themeColor: "#0c2035",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteMetadata.title,
    template: "%s | Kimziz Global Links Ltd.",
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteUrl,
    siteName: siteMetadata.openGraph.siteName,
    locale: siteMetadata.openGraph.locale,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Kimziz Global Links Ltd. - Import, Export & Automotive",
      },
      {
        url: "/brand/kimziz-logo.png",
        width: 630,
        height: 630,
        alt: "Kimziz Global Links Ltd. Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: ["/opengraph-image", "/brand/kimziz-logo.png"],
  },
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
    googleBot: {
      index: allowIndexing,
      follow: allowIndexing,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

/**
 * Builds dynamic public metadata merging database configuration (Site) with baseline SEO.
 */
export function buildDynamicMetadata(site: Site): Metadata {
  const socialImage = site.socialImage || "/opengraph-image";
  const title = site.seoTitle || siteMetadata.title;
  const description = site.seoDescription || siteMetadata.description;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${site.name}`,
    },
    description,
    keywords: [site.name, ...siteMetadata.keywords],
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: socialImage,
          alt: site.name,
          ...(!site.socialImage ? { width: 1200, height: 630 } : {}),
        },
        {
          url: "/brand/kimziz-logo.png",
          alt: `${site.name} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage, "/brand/kimziz-logo.png"],
    },
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: {
        index: allowIndexing,
        follow: allowIndexing,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Builds schema.org JSON-LD structured data for Google & search crawlers.
 */
export function buildJsonLd(site: Site) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: site.name,
        description: site.seoDescription || siteMetadata.description,
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        inLanguage: "en-US",
      },
      {
        "@type": ["Organization", "LocalBusiness", "AutoDealer"],
        "@id": `${siteUrl}/#organization`,
        name: site.name,
        legalName: site.name,
        description: site.seoDescription || siteMetadata.description,
        url: siteUrl,
        logo: `${siteUrl}/brand/kimziz-logo.png`,
        image: `${siteUrl}/opengraph-image`,
        telephone: site.phone
          ? `+234${site.phone.replace(/^0/, "")}`
          : "+2347014615680",
        email: site.email || "kimzizdoc@gmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress:
            site.address ||
            "Office 004, second floor, Scorpio Block, Eleganza Plaza",
          addressLocality: "Apapa",
          addressRegion: "Lagos",
          addressCountry: "NG",
        },
        identifier: site.registration || "RC 1922809",
        priceRange: "$$",
      },
    ],
  };
}

/**
 * Helper to build vehicle-specific metadata
 */
export function buildVehicleMetadata(
  vehicle: Vehicle,
  id: string,
  site: Site,
): Metadata {
  const price = priceLabel(vehicle);
  const title = vehicle.title
    ? `${vehicle.title} (${vehicle.condition})`
    : `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.condition})`;
  const description =
    vehicle.description ||
    `${title} for sale in ${vehicle.location || "Apapa, Lagos"}. Price: ${price}. Contact Kimziz Global Links Ltd. on WhatsApp.`;
  const image = vehicle.images[0]?.url || "/brand/kimziz-logo.png";
  const vehicleUrl = `${siteUrl}/cars/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: vehicleUrl,
    },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: vehicleUrl,
      type: "website",
      images: [
        {
          url: image,
          alt: title,
        },
      ],
      siteName: site.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [image],
    },
  };
}
