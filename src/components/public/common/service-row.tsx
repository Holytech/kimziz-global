import type { LucideIcon } from "lucide-react";
import { Site } from "@/lib/model";
import { Enquiry } from "@/components/shell";

export type ServiceItem = Site["services"][number];

export interface ServiceRowProps {
  service: ServiceItem;
  index: number;
  site: Site;
  icon: LucideIcon;
}

export function ServiceRow({
  service,
  index,
  site,
  icon: Icon,
}: Readonly<ServiceRowProps>) {
  return (
    <div className="grid grid-cols-[24px_32px_1fr_44px] md:grid-cols-[40px_48px_1fr_1.5fr_48px] gap-4 md:gap-6 items-center border-b border-line py-7 md:py-8">
      <span className="text-[0.68rem] text-muted font-medium">
        {String(index + 1).padStart(2, "0")}
      </span>
      <Icon
        className="w-7 h-7 md:w-8 md:h-8 text-[#a17b3b]"
        strokeWidth={1.3}
      />
      <h3 className="text-lg md:text-xl font-medium tracking-tight text-ink m-0">
        {service.title}
      </h3>
      <p className="text-xs md:text-sm text-muted max-w-[420px] m-0 col-span-3 md:col-auto">
        {service.description}
      </p>
      <Enquiry
        site={site}
        message={`Hello ${site.name}, I would like to enquire about ${service.title.toLowerCase()}.`}
        className="w-11 h-11 grid place-items-center border border-line rounded-full hover:bg-gold hover:text-navy hover:border-gold transition-colors text-ink ml-auto cursor-pointer"
      >
        <span className="sr-only">Enquire about {service.title}</span>
      </Enquiry>
    </div>
  );
}
