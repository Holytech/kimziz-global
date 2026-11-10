"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Moon, Sun, X, MoveUpRight } from "lucide-react";
import { Site, whatsappUrl } from "@/lib/model";
import { track } from "@vercel/analytics";
export function Enquiry({
  site,
  message,
  children,
  className = "button",
}: {
  site: Site;
  message?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={whatsappUrl(
        site.whatsapp,
        message ?? `Hello ${site.name}, I would like to discuss an enquiry.`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true")
          track("whatsapp_enquiry_click");
      }}
    >
      {children ?? site.ctaLabel}
      <ArrowUpRight size={18} />
    </a>
  );
}
export function Brand({ site }: { site: Site }) {
  return (
    <Link href="/" className="brand" aria-label={`${site.name} home`}>
      {site.logo ? (
        <img src={site.logo} alt={site.name} />
      ) : (
        <>
          <span className="brand-symbol">
            <MoveUpRight strokeWidth={1.4} />
          </span>
          <span>
            KIMZIZ<small>GLOBAL LINKS LTD.</small>
          </span>
        </>
      )}
    </Link>
  );
}
export function Shell({
  site,
  children,
}: {
  site: Site;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false),
    [dark, setDark] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const sync = () =>
      setDark(document.documentElement.dataset.theme === "dark");
    sync();
  }, []);
  function toggleTheme() {
    const value = !dark;
    setDark(value);
    document.documentElement.dataset.theme = value ? "dark" : "light";
    try {
      localStorage.setItem("kimziz-theme", value ? "dark" : "light");
    } catch {}
  }
  const links = [
    ["/", site.nav.home],
    ["/about", site.nav.about],
    ["/services", site.nav.services],
    ["/cars", site.nav.cars],
    ["/contact", site.nav.contact],
  ];
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="topbar">
        <div className="container">
          <span>
            IMPORTATION <i /> EXPORTATION <i /> CAR DEALINGS
          </span>
          <a href={`tel:${site.phone}`}>{site.phone}</a>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Brand site={site} />
          <nav
            id="mobile-nav"
            className={open ? "nav is-open" : "nav"}
            aria-label="Main navigation"
          >
            {links.map(([url, label]) => (
              <Link
                href={url}
                key={url}
                onClick={() => setOpen(false)}
                aria-current={path === url ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={toggleTheme}
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <Enquiry site={site} className="button header-cta" />
            <button
              className="icon-button mobile-menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer>
        <div className="container footer-grid">
          <div>
            <Brand site={site} />
            <p>{site.footer}</p>
          </div>
          <div>
            <h3>Explore</h3>
            {links.slice(1).map(([url, label]) => (
              <Link key={url} href={url}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <h3>Get in touch</h3>
            <a href={`tel:${site.phone}`}>{site.phone}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <p>{site.address}</p>
            {site.hours && <p>{site.hours}</p>}
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>{site.registration}</span>
          <div>
            {site.social.map((s) => (
              <a
                key={s.url}
                href={s.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
