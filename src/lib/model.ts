import { z } from "zod";
const text = z.string().trim().max(6000);
const short = z.string().trim().max(200);
export const safeUrl = z
  .string()
  .refine(
    (v) =>
      !v ||
      (v.startsWith("/") && !v.startsWith("//") && !v.includes("\\")) ||
      /^https:\/\/[^\s]+$/.test(v),
    "Use an HTTPS URL or a local /path",
  );
const image = z.object({ url: safeUrl, alt: short });
export const siteSchema = z.object({
  name: short.min(1),
  phone: z.string().regex(/^\+?[0-9 ()-]{7,25}$/),
  whatsapp: z.string().regex(/^[1-9][0-9]{7,14}$/),
  email: z.email(),
  address: text,
  registration: short,
  logo: safeUrl,
  hours: short,
  history: text,
  leadership: text,
  headline: short.min(1),
  intro: text,
  heroImage: safeUrl,
  heroAlt: short,
  heroVideo: safeUrl,
  aboutTitle: short,
  about: text,
  servicesTitle: short,
  carsTitle: short,
  carsIntro: text,
  contactTitle: short,
  contactIntro: text,
  ctaLabel: short.min(1),
  ctaTitle: short,
  ctaText: text,
  footer: text,
  nav: z.object({
    home: short,
    about: short,
    services: short,
    cars: short,
    contact: short,
  }),
  seoTitle: short,
  seoDescription: z.string().max(320),
  socialImage: safeUrl,
  social: z.array(z.object({ label: short, url: safeUrl })).max(10),
  services: z
    .array(
      z.object({
        title: short.min(1),
        description: text,
        visible: z.boolean(),
      }),
    )
    .max(20),
});
export type Site = z.infer<typeof siteSchema>;
export const vehicleSchema = z.object({
  title: short.min(1),
  make: short.min(1),
  model: short.min(1),
  year: z.number().int().min(1900).max(2100),
  condition: z.enum(["Foreign used", "Nigerian used", "New"]),
  mileage: z.number().nonnegative().nullable(),
  mileageUnit: z.enum(["km", "mi"]),
  transmission: z.enum(["Automatic", "Manual"]),
  fuel: short,
  colour: short,
  location: short,
  description: text,
  features: text,
  price: z.number().positive().nullable(),
  currency: z.enum(["NGN", "USD", "GBP", "EUR"]),
  availability: z.enum(["available", "reserved", "sold"]),
  images: z.array(image).max(20),
  video: safeUrl,
  featured: z.boolean(),
  order: z.number().int(),
});
export type Vehicle = z.infer<typeof vehicleSchema>;
export type DocumentRow = {
  id: string;
  kind: "site" | "vehicle";
  draft: unknown;
  revision: number;
  updated_at: string;
  updated_by: string | null;
};
export type Listing = Vehicle & { id: string };
export const emptyVehicle: Vehicle = {
  title: "",
  make: "",
  model: "",
  year: 2026,
  condition: "Foreign used",
  mileage: null,
  mileageUnit: "km",
  transmission: "Automatic",
  fuel: "Petrol",
  colour: "",
  location: "",
  description: "",
  features: "",
  price: null,
  currency: "NGN",
  availability: "available",
  images: [],
  video: "",
  featured: false,
  order: 0,
};
export function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
export function priceLabel(v: Vehicle) {
  return v.price === null
    ? "Price on request"
    : new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: v.currency,
        maximumFractionDigits: 0,
      }).format(v.price);
}
