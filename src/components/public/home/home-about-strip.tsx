import Link from "next/link";
import { ArrowUpRight, Globe2 } from "lucide-react";
import { Site } from "@/lib/model";

export interface HomeAboutStripProps {
  site: Site;
}

export function HomeAboutStrip({ site }: Readonly<HomeAboutStripProps>) {
  return (
    <section className="bg-soft py-16 md:py-20 border-y border-line">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="bg-navy text-[#d4b477] min-h-65 md:min-h-82.5 flex items-center justify-center gap-6 p-8 md:p-11 rounded-md">
          <Globe2 size={100} strokeWidth={0.7} />
          <span className="text-xs md:text-[0.8rem] tracking-[0.17em] leading-[2.2] font-semibold">
            LOCAL CONNECTIONS.
            <br />
            GLOBAL OUTLOOK.
          </span>
        </div>
        <div>
          <span className="block text-[0.68rem] font-bold tracking-[0.19em] uppercase text-muted mb-4">
            MEET KIMZIZ GLOBAL
          </span>
          <h2 className="text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[1.15] tracking-[-0.04em] text-ink mb-4 whitespace-pre-line">
            {site.aboutTitle}
          </h2>
          <p className="text-sm md:text-[0.95rem] text-muted leading-[1.85] mb-6 max-w-[520px]">
            {site.about}
          </p>
          <Link
            className="inline-flex items-center gap-3 text-sm md:text-[0.86rem] font-semibold text-ink hover:text-gold transition-colors min-h-[44px]"
            href="/about"
          >
            More about us <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
