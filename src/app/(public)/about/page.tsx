import type { Metadata } from "next";
import { AboutContent } from "@/components/public/about";
import { getSite } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Kimziz Global Links Ltd. in Apapa, Lagos — our mission, leadership, and expertise in international importation, exportation, and verified automobile dealings.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Kimziz Global Links Ltd.",
    description:
      "Learn about Kimziz Global Links Ltd. in Apapa, Lagos — our mission, leadership, and expertise in international importation, exportation, and verified automobile dealings.",
    url: "/about",
  },
};

export default async function Page() {
  return <AboutContent site={await getSite()} />;
}
