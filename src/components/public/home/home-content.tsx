import { Listing, Site } from "@/lib/model";
import { Reveal } from "@/components/reveal";
import { ServicesList } from "../common/services-list";
import { CTA } from "../common/cta";
import { HomeHero } from "./home-hero";
import { HomeAboutStrip } from "./home-about-strip";
import { HomeVehicles } from "./home-vehicles";
import { HomeVideo } from "./home-video";

export interface HomeContentProps {
  site: Site;
  listings: Listing[];
}

export function HomeContent({ site, listings }: Readonly<HomeContentProps>) {
  return (
    <>
      <HomeHero site={site} />
      <section
        className="container py-16 md:py-24 border-t border-line"
        id="services"
      >
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <span className="block text-[0.68rem] font-bold tracking-[0.19em] uppercase text-muted mb-2">
                WHAT WE DO
              </span>
              <h2 className="text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[1.15] tracking-tight text-ink m-0">
                {site.servicesTitle}
              </h2>
            </div>
            <p className="text-sm text-muted max-w-[300px] mb-1">
              One conversation. The right starting point for your trade and
              vehicle needs.
            </p>
          </div>
          <ServicesList site={site} />
        </Reveal>
      </section>
      <HomeAboutStrip site={site} />
      <HomeVehicles site={site} listings={listings} />
      {site.heroVideo && <HomeVideo src={site.heroVideo} />}
      <CTA site={site} />
    </>
  );
}
