import { ContactContent } from "@/components/public-content";
import { getSite } from "@/lib/data";
export const metadata = { title: "Contact" };
export default async function Page() {
  return <ContactContent site={await getSite()} />;
}
