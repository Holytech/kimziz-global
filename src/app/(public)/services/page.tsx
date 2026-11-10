import type { Metadata } from "next";
import { ServicesContent } from "@/components/public-content";
import { getSite } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore services by Kimziz Global Links Ltd.: seamless importation into Nigeria, product exportation, shipping logistics, and quality car sourcing in Apapa, Lagos.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Our Services | Kimziz Global Links Ltd.",
    description:
      "Explore services by Kimziz Global Links Ltd.: seamless importation into Nigeria, product exportation, shipping logistics, and quality car sourcing in Apapa, Lagos.",
    url: "/services",
  },
};

export default async function Page() {
  return <ServicesContent site={await getSite()} />;
}
