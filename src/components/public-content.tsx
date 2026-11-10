import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Ship,
  Globe2,
  CarFront,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Site, Listing, priceLabel } from "@/lib/model";
import { Enquiry } from "./shell";
import { TradeArt } from "./trade-art";
import { Reveal } from "./reveal";
export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-title">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
export function CTA({ site }: { site: Site }) {
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <span className="eyebrow">LET’S MAKE IT HAPPEN</span>
          <h2>{site.ctaTitle}</h2>
          <p>{site.ctaText}</p>
        </div>
        <Enquiry site={site} />
      </div>
    </section>
  );
}
export function ServicesList({ site }: { site: Site }) {
  const icons = [Ship, Globe2, CarFront];
  return (
    <div className="services-list">
      {site.services
        .filter((s) => s.visible)
        .map((s, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div className="service-row" key={s.title}>
              <span className="row-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Icon className="service-icon" strokeWidth={1.3} />
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <Enquiry
                site={site}
                message={`Hello ${site.name}, I would like to enquire about ${s.title.toLowerCase()}.`}
                className="circle-link"
              >
                <span className="sr-only">Enquire about {s.title}</span>
              </Enquiry>
            </div>
          );
        })}
    </div>
  );
}
export function HomeContent({
  site,
  listings,
}: {
  site: Site;
  listings: Listing[];
}) {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="gold-line" /> YOUR NEXT MOVE, CONNECTED
            </span>
            <h1>{site.headline}</h1>
            <p>{site.intro}</p>
            <div className="button-row">
              <Enquiry site={site} />
              <Link className="text-link" href="/services">
                Explore our services <ArrowRight size={18} />
              </Link>
            </div>
            <div className="hero-footnote">
              <span>{site.registration}</span>
              <span>APAPA, LAGOS</span>
            </div>
          </div>
          {site.heroImage ? (
            <div className="hero-photo">
              <img src={site.heroImage} alt={site.heroAlt} />
            </div>
          ) : (
            <TradeArt />
          )}
        </div>
        <div className="hero-bottom container">
          <span>TRADE WITH PURPOSE.</span>
          <span>MOVE WITH CONFIDENCE.</span>
          <a href="#services" aria-label="Explore services below">
            SCROLL TO EXPLORE ↓
          </a>
        </div>
      </section>
      <section className="section container" id="services">
        <Reveal>
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHAT WE DO</span>
              <h2>{site.servicesTitle}</h2>
            </div>
            <p>
              One conversation. The right starting point for your trade and
              vehicle needs.
            </p>
          </div>
          <ServicesList site={site} />
        </Reveal>
      </section>
      <section className="about-strip">
        <div className="container split">
          <div className="about-visual">
            <Globe2 size={100} strokeWidth={0.7} />
            <span>
              LOCAL CONNECTIONS.
              <br />
              GLOBAL OUTLOOK.
            </span>
          </div>
          <div>
            <span className="eyebrow">MEET KIMZIZ</span>
            <h2>{site.aboutTitle}</h2>
            <p>{site.about}</p>
            <Link className="text-link" href="/about">
              More about us <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">KIMZIZ AUTOMOTIVE</span>
            <h2>{site.carsTitle}</h2>
          </div>
          <Link className="text-link" href="/cars">
            Explore cars <ArrowRight size={18} />
          </Link>
        </div>
        {listings.some((v) => v.featured) ? (
          <div className="vehicle-grid">
            {listings
              .filter((v) => v.featured)
              .slice(0, 3)
              .map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
          </div>
        ) : (
          <div className="car-invitation">
            <CarFront size={64} strokeWidth={1} />
            <div>
              <h3>A car that fits your plans.</h3>
              <p>
                Tell us your preferred make, model and budget. Contact us to
                discuss current options.
              </p>
            </div>
            <Enquiry
              site={site}
              message={`Hello ${site.name}, I am looking for a car. My preferred make/model is: . My budget is: .`}
            >
              Find my next car
            </Enquiry>
          </div>
        )}
      </section>
      {site.heroVideo && (
        <section className="container section">
          <h2>A closer look</h2>
          <video
            controls
            preload="none"
            src={site.heroVideo}
            aria-label="Kimziz introduction video"
          />
        </section>
      )}
      <CTA site={site} />
    </>
  );
}
export function AboutContent({ site }: { site: Site }) {
  return (
    <>
      <section className="page-hero container">
        <SectionTitle
          eyebrow="ABOUT KIMZIZ"
          title={site.aboutTitle}
          description={site.about}
        />
      </section>
      <section className="container split section">
        <TradeArt />
        <div>
          <span className="eyebrow">BASED IN APAPA. OPEN TO POSSIBILITY.</span>
          <h2>
            Let’s start with
            <br />
            what you need.
          </h2>
          <p>
            From goods and trade enquiries to your next vehicle, speak directly
            with our team about your plans.
          </p>
          {site.history && <p>{site.history}</p>}
          {site.leadership && <p>{site.leadership}</p>}
          <p className="registration">
            {site.name} · {site.registration}
          </p>
          <Enquiry site={site} />
        </div>
      </section>
      <CTA site={site} />
    </>
  );
}
export function ServicesContent({ site }: { site: Site }) {
  return (
    <>
      <section className="page-hero container">
        <SectionTitle
          eyebrow="OUR SERVICES"
          title={site.servicesTitle}
          description="Explore how we can help, then tell us about your specific requirements."
        />
      </section>
      <section className="container section section-topless">
        <ServicesList site={site} />
      </section>
      <section className="container section">
        <span className="eyebrow">BEFORE WE TALK</span>
        <h2>A few details go a long way.</h2>
        <div className="steps">
          {[
            [
              "01",
              "Tell us what you need",
              "Share your service enquiry or preferred vehicle.",
            ],
            [
              "02",
              "Share the details",
              "For trade, include origin, destination and goods. For cars, include your preferences and budget.",
            ],
            [
              "03",
              "Discuss the next step",
              "Continue on WhatsApp to discuss options and requirements directly.",
            ],
          ].map(([n, t, d]) => (
            <div key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <CTA site={site} />
    </>
  );
}
export function ContactContent({ site }: { site: Site }) {
  return (
    <>
      <section className="page-hero container">
        <SectionTitle
          eyebrow="GET IN TOUCH"
          title={site.contactTitle}
          description={site.contactIntro}
        />
      </section>
      <section className="container contact-grid section section-topless">
        <div className="contact-panel">
          <span className="eyebrow">A DIRECT CONVERSATION</span>
          <h2>How can we help?</h2>
          <p>
            For a vehicle, share your preferences and budget. For import or
            export enquiries, include details of your goods, origin and
            destination.
          </p>
          <Enquiry site={site}>Chat on WhatsApp</Enquiry>
        </div>
        <div className="contact-details">
          {[
            [Phone, "Call us", site.phone, `tel:${site.phone}`],
            [Mail, "Email us", site.email, `mailto:${site.email}`],
            [MapPin, "Visit our office", site.address, ""],
          ].map(([Icon, title, value, href]) => {
            const I = Icon as typeof Phone;
            return (
              <div key={String(title)}>
                <I size={22} />
                <div>
                  <span className="eyebrow">{String(title)}</span>
                  {href ? (
                    <a href={String(href)}>{String(value)}</a>
                  ) : (
                    <p>{String(value)}</p>
                  )}
                </div>
              </div>
            );
          })}
          {site.hours && <p>Opening hours: {site.hours}</p>}
        </div>
      </section>
    </>
  );
}
export function VehicleCard({ vehicle: v }: { vehicle: Listing }) {
  return (
    <Link href={`/cars/${v.id}`} className="vehicle-card">
      <div className="vehicle-cover">
        {v.images[0] ? (
          <img
            src={v.images[0].url}
            alt={v.images[0].alt || v.title}
            loading="lazy"
          />
        ) : (
          <CarFront size={64} strokeWidth={1} />
        )}
        <span className={`badge ${v.availability}`}>{v.availability}</span>
      </div>
      <div className="vehicle-info">
        <span className="eyebrow">
          {v.year} · {v.condition}
        </span>
        <h3>{v.title}</h3>
        <p>
          {v.transmission} ·{" "}
          {v.mileage === null
            ? "Mileage on request"
            : `${v.mileage.toLocaleString()} ${v.mileageUnit}`}
        </p>
        <div>
          <strong>{priceLabel(v)}</strong>
          <ArrowUpRight size={20} />
        </div>
      </div>
    </Link>
  );
}
export function VehicleDetail({
  site,
  vehicle: v,
}: {
  site: Site;
  vehicle: Listing;
}) {
  return (
    <section className="container section">
      <Link className="text-link" href="/cars">
        ← All cars
      </Link>
      <div className="detail-grid">
        <div>
          {v.images.length ? (
            <div className="gallery">
              {v.images.map((im, i) => (
                <img
                  key={i}
                  src={im.url}
                  alt={im.alt || v.title}
                  loading={i ? "lazy" : "eager"}
                />
              ))}
            </div>
          ) : (
            <div className="empty-image">
              <CarFront size={100} />
            </div>
          )}
          {v.video && <video controls preload="none" src={v.video} />}
        </div>
        <div>
          <span className={`badge ${v.availability}`}>{v.availability}</span>
          <h1>{v.title}</h1>
          <p className="detail-price">{priceLabel(v)}</p>
          <dl>
            {[
              ["Year", v.year],
              ["Condition", v.condition],
              ["Transmission", v.transmission],
              [
                "Mileage",
                v.mileage === null
                  ? "On request"
                  : `${v.mileage} ${v.mileageUnit}`,
              ],
              ["Fuel", v.fuel],
              ["Colour", v.colour],
              ["Location", v.location],
            ]
              .filter(([, value]) => value !== "")
              .map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>
          <p>{v.description}</p>
          {v.features && <p className="preserve-lines">{v.features}</p>}
          <Enquiry
            site={site}
            message={`Hello ${site.name}, I would like to enquire about ${v.title} (${v.year}). Reference: ${v.id}. Status: ${v.availability}. ${process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/cars/${v.id}` : `/cars/${v.id}`}`}
          >
            {v.availability === "available"
              ? "Enquire about this car"
              : "Ask about similar cars"}
          </Enquiry>
          <p className="small muted">
            Confirm availability and details directly. No payment is taken on
            this website.
          </p>
        </div>
      </div>
    </section>
  );
}
