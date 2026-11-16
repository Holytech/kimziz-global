import { Site } from "@/lib/model";
import { SectionTitle } from "../common/section-title";
import { ServicesList } from "../common/services-list";
import { CTA } from "../common/cta";
import { ProcessSteps } from "./process-steps";

export interface ServicesContentProps {
  site: Site;
}

export function ServicesContent({ site }: Readonly<ServicesContentProps>) {
  return (
    <>
      <section className="container pt-16 pb-12 md:pt-20 md:pb-16">
        <SectionTitle
          eyebrow="OUR SERVICES"
          title={site.servicesTitle}
          description="Explore how we can help, then tell us about your specific requirements."
        />
      </section>
      <section className="container pb-16 md:pb-20">
        <ServicesList site={site} />
      </section>
      <ProcessSteps />
      <CTA site={site} />
    </>
  );
}
