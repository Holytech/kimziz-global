import type { Metadata } from "next";
import { Catalogue } from "@/components/public/cars";
import { SectionTitle } from "@/components/public/common";
import { getSite, getListings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cars & Automotive Dealings",
  description:
    "Browse verified cars for sale by Kimziz Global Links Ltd. in Lagos, Nigeria. Foreign used, Nigerian used, and quality vehicles with direct WhatsApp enquiries.",
  alternates: {
    canonical: "/cars",
  },
  openGraph: {
    title: "Cars & Automotive Dealings | Kimziz Global Links Ltd.",
    description:
      "Browse verified cars for sale by Kimziz Global Links Ltd. in Lagos, Nigeria. Foreign used, Nigerian used, and quality vehicles with direct WhatsApp enquiries.",
    url: "/cars",
  },
};

export default async function Cars() {
  const [site, listings] = await Promise.all([getSite(), getListings()]);
  return (
    <>
      <section className="page-hero container">
        <SectionTitle
          eyebrow="KIMZIZ AUTOMOTIVE"
          title={site.carsTitle}
          description={site.carsIntro}
        />
      </section>
      <section className="container section section-topless">
        <Catalogue site={site} listings={listings} />
      </section>
    </>
  );
}
