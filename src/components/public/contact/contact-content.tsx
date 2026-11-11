import { Site } from "@/lib/model";
import { SectionTitle } from "../common/section-title";
import { ContactPanel } from "./contact-panel";
import { ContactDetails } from "./contact-details";

export interface ContactContentProps {
  site: Site;
}

export function ContactContent({ site }: Readonly<ContactContentProps>) {
  return (
    <>
      <section className="container pt-16 pb-12 md:pt-20 md:pb-16">
        <SectionTitle
          eyebrow="GET IN TOUCH"
          title={site.contactTitle}
          description={site.contactIntro}
        />
      </section>
      <section className="container grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 pb-16 md:pb-24">
        <ContactPanel site={site} />
        <ContactDetails site={site} />
      </section>
    </>
  );
}
