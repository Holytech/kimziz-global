import { Catalogue } from "@/components/catalogue";
import { SectionTitle } from "@/components/public-content";
import { getSite, getListings } from "@/lib/data";
export const metadata = { title: "Cars" };
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
