import { AboutContent } from "@/components/public-content";
import { getSite } from "@/lib/data";
export const metadata = { title: "About" };
export default async function Page() {
  return <AboutContent site={await getSite()} />;
}
