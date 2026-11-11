import { Ship, Globe2, CarFront } from "lucide-react";
import { Site } from "@/lib/model";
import { ServiceRow } from "./service-row";

export interface ServicesListProps {
  site: Site;
}

const SERVICE_ICONS = [Ship, Globe2, CarFront];

export function ServicesList({ site }: Readonly<ServicesListProps>) {
  return (
    <div className="border-t border-line">
      {site.services
        .filter((s) => s.visible)
        .map((service, i) => (
          <ServiceRow
            key={service.title}
            service={service}
            index={i}
            site={site}
            icon={SERVICE_ICONS[i % SERVICE_ICONS.length]}
          />
        ))}
    </div>
  );
}
