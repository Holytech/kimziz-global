import { CarFront } from "lucide-react";
import { Site } from "@/lib/model";
import { Enquiry } from "@/components/shell";

export interface CarInvitationProps {
  site: Site;
  title?: string;
  description?: string;
}

export function CarInvitation({
  site,
  title = "A car that fits your plans.",
  description = "Tell us your preferred brand, model and budget. Contact us to discuss current options.",
}: Readonly<CarInvitationProps>) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-9 bg-surface border border-line p-7 md:p-10 rounded-[10px]">
      <CarFront size={64} strokeWidth={1} className="shrink-0 text-[#a17b3b]" />
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium tracking-tight text-ink mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted max-w-[470px] m-0">{description}</p>
      </div>
      <Enquiry
        site={site}
        message={`Hello ${site.name}, I am looking for a car. My preferred brand/model is: . My budget is: .`}
        className="sm:ml-auto shrink-0 inline-flex items-center justify-center gap-4 min-h-[50px] px-6 py-3 bg-gold text-navy border border-gold rounded-[3px] text-sm font-semibold whitespace-nowrap hover:bg-gold-hover hover:border-gold-hover transition-colors cursor-pointer"
      >
        Find my next car
      </Enquiry>
    </div>
  );
}
