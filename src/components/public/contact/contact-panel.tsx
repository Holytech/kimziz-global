import { Site } from "@/lib/model";
import { Enquiry } from "@/components/shell";

export interface ContactPanelProps {
  site: Site;
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
}

export function ContactPanel({
  site,
  eyebrow = "A DIRECT CONVERSATION",
  title = "How can we help?",
  description = "For a vehicle, share your preferences and budget. For import or export enquiries, include details of your goods, origin and destination.",
  buttonLabel = "Chat on WhatsApp",
}: Readonly<ContactPanelProps>) {
  return (
    <div className="bg-navy p-8 md:p-11 text-white rounded-[10px]">
      <span className="block text-[0.68rem] font-bold tracking-[0.19em] uppercase text-gold mb-3">
        {eyebrow}
      </span>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-4">
        {title}
      </h2>
      <p className="text-[#bdc9d2] text-sm md:text-base leading-relaxed mb-8">
        {description}
      </p>
      <Enquiry site={site}>{buttonLabel}</Enquiry>
    </div>
  );
}
