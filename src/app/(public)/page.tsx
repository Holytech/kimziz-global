import { HomeContent } from "@/components/public/home";
import { getSite, getListings } from "@/lib/data";

export default async function Home() {
  const [site, listings] = await Promise.all([getSite(), getListings()]);
  return <HomeContent site={site} listings={listings} />;
}
