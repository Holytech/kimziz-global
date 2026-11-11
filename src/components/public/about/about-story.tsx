import { Site } from "@/lib/model";
import { Enquiry } from "@/components/shell";
import { TradeArt } from "@/components/trade-art";

export interface AboutStoryProps {
  site: Site;
}

export function AboutStory({ site }: Readonly<AboutStoryProps>) {
  return (
    <section className="container grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center py-16 md:py-20 border-t border-line">
      <TradeArt />
      <div>
        <span className="block text-[0.68rem] font-bold tracking-[0.19em] uppercase text-muted mb-4">
          BASED IN APAPA. OPEN TO POSSIBILITY.
        </span>
        <h2 className="text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[1.15] tracking-tight text-ink mb-5 whitespace-pre-line">
          Let’s start with
          <br />
          what you need.
        </h2>
        <p className="text-sm md:text-base text-muted leading-[1.85] mb-4">
          From goods and trade enquiries to your next vehicle, speak directly
          with our team about your plans.
        </p>
        {site.history && (
          <p className="text-sm md:text-base text-muted leading-[1.85] mb-4">
            {site.history}
          </p>
        )}
        {site.leadership && (
          <p className="text-sm md:text-base text-muted leading-[1.85] mb-4">
            {site.leadership}
          </p>
        )}
        <p className="text-xs text-muted font-medium tracking-wider mb-6 block">
          {site.name} · {site.registration}
        </p>
        <Enquiry site={site} />
      </div>
    </section>
  );
}
