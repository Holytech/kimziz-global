import { Phone, Mail, MapPin } from "lucide-react";
import { Site } from "@/lib/model";

export interface ContactDetailsProps {
  site: Site;
}

export function ContactDetails({ site }: Readonly<ContactDetailsProps>) {
  const contactItems = [
    {
      Icon: Phone,
      title: "Call us",
      value: site.phone,
      href: `tel:${site.phone}`,
    },
    {
      Icon: Mail,
      title: "Email us",
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      Icon: MapPin,
      title: "Visit our office",
      value: site.address,
      href: "",
    },
  ];

  return (
    <div className="flex flex-col">
      {contactItems.map(({ Icon, title, value, href }) => (
        <div
          key={title}
          className="flex items-start gap-5 py-6 border-b border-line"
        >
          <Icon size={22} className="text-[#a17b3b] shrink-0 mt-1" />
          <div>
            <span className="block text-[0.68rem] font-bold tracking-[0.15em] uppercase text-muted mb-1">
              {title}
            </span>
            {href ? (
              <a
                href={href}
                className="text-base font-medium text-ink hover:text-gold transition-colors"
              >
                {value}
              </a>
            ) : (
              <p className="text-base font-medium text-ink m-0">{value}</p>
            )}
          </div>
        </div>
      ))}
      {site.hours && (
        <p className="text-xs text-muted mt-6">Opening hours: {site.hours}</p>
      )}
    </div>
  );
}
