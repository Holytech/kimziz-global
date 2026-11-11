import type { Metadata } from "next";
import { ContactContent } from "@/components/public/contact";
import { getSite } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Kimziz Global Links Ltd. in Apapa, Lagos. Start a conversation on WhatsApp or call for your import, export, and car enquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Kimziz Global Links Ltd.",
    description:
      "Get in touch with Kimziz Global Links Ltd. in Apapa, Lagos. Start a conversation on WhatsApp or call for your import, export, and car enquiries.",
    url: "/contact",
  },
};

export default async function Page() {
  return <ContactContent site={await getSite()} />;
}
