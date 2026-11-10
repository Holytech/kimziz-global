import { ServicesContent } from "@/components/public-content";
import { getSite } from "@/lib/data";
export const metadata = { title: "Services" };
export default async function Page() {
  return <ServicesContent site={await getSite()} />;
}
