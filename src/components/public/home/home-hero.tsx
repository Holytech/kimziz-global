import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Site } from "@/lib/model";
import { Enquiry } from "@/components/shell";
import { TradeArt } from "@/components/trade-art";

export interface HomeHeroProps {
  site: Site;
}

export function HomeHero({ site }: Readonly<HomeHeroProps>) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="container grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-9 items-center min-h-[580px] lg:min-h-[610px] 2xl:min-h-[660px] py-12 lg:py-16">
        <div className="flex flex-col">
          <span className="flex items-center gap-3 text-gold text-[0.68rem] font-bold tracking-[0.19em] uppercase mb-5">
            <span className="w-7 h-[1px] bg-gold inline-block" /> YOUR NEXT
            MOVE, CONNECTED
          </span>
          <h1 className="text-[clamp(2.5rem,5vw,4.7rem)] font-medium leading-[1.13] tracking-[-0.045em] mb-6 whitespace-pre-line text-white">
            {site.headline}
          </h1>
          <p className="text-[#b8c6d0] text-base md:text-[1.02rem] max-w-[440px] leading-[1.85] mb-8">
            {site.intro}
          </p>
          <div className="flex items-center gap-6 sm:gap-7 flex-wrap">
            <Enquiry site={site} />
            <Link
              className="inline-flex items-center gap-3 text-sm md:text-[0.86rem] font-semibold text-[#e3e8ec] hover:text-gold transition-colors min-h-[44px]"
              href="/services"
            >
              Explore our services <ArrowRight size={18} />
            </Link>
          </div>
          <div className="flex items-center gap-7 text-[0.63rem] tracking-[0.13em] text-[#a8b7c3] mt-10 md:mt-14">
            <span>{site.registration}</span>
            <span className="pl-7 border-l border-[#60707c]">APAPA, LAGOS</span>
          </div>
        </div>
        {site.heroImage ? (
          <div className="h-[380px] md:h-[480px] rounded overflow-hidden">
            <img
              src={site.heroImage}
              alt={site.heroAlt}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <TradeArt />
        )}
      </div>
      <div className="container border-t border-white/15 flex items-center justify-between gap-6 py-5 text-[0.55rem] sm:text-[0.63rem] tracking-[0.16em] text-[#a8b7c3]">
        <span>TRADE WITH PURPOSE.</span>
        <span className="hidden sm:inline">MOVE WITH CONFIDENCE.</span>
        <a
          href="#services"
          aria-label="Explore services below"
          className="ml-auto hover:text-gold transition-colors"
        >
          SCROLL TO EXPLORE ↓
        </a>
      </div>
    </section>
  );
}
