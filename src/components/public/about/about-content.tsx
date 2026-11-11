import { Site } from "@/lib/model";
import { SectionTitle } from "../common/section-title";
import { CTA } from "../common/cta";
import { AboutStory } from "./about-story";

export interface AboutContentProps {
  site: Site;
}

export function AboutContent({ site }: Readonly<AboutContentProps>) {
  return (
    <>
      <section className="container pt-16 pb-12 md:pt-20 md:pb-16">
        <SectionTitle
          eyebrow="ABOUT KIMZIZ"
          title={site.aboutTitle}
          description={site.about}
        />
      </section>
      <AboutStory site={site} />
      <CTA site={site} />
    </>
  );
}
