import { Site } from "@/lib/model";
import { Enquiry } from "@/components/shell";

export interface CTAProps {
  site: Site;
  eyebrow?: string;
  title?: string;
  text?: string;
}

export function CTA({
  site,
  eyebrow = "LET’S MAKE IT HAPPEN",
  title,
  text,
}: Readonly<CTAProps>) {
  return (
    <section className="bg-navy text-white py-16 md:py-20">
      <div className="container flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-10">
        <div>
          <span className="block text-[0.68rem] font-bold tracking-[0.19em] uppercase text-gold mb-2">
            {eyebrow}
          </span>
          <h2 className="text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[1.15] tracking-tight text-white mb-3">
            {title ?? site.ctaTitle}
          </h2>
          <p className="text-[#aebdc8] text-sm md:text-base max-w-[500px] leading-relaxed mb-0">
            {text ?? site.ctaText}
          </p>
        </div>
        <Enquiry site={site} />
      </div>
    </section>
  );
}
