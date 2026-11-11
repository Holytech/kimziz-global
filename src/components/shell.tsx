"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { Site, whatsappUrl } from "@/lib/model";
import { track } from "@vercel/analytics";

export function Enquiry({
  site,
  message,
  children,
  className = "inline-flex items-center justify-center gap-4 min-h-[50px] px-6 py-3 bg-gold text-navy border border-gold rounded-[3px] text-sm font-semibold whitespace-nowrap hover:bg-gold-hover hover:border-gold-hover transition-colors cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed",
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

export function Brand({
  site,
  size = "default",
}: {
  site: Site;
  size?: "default" | "large" | "admin";
}) {
  const sizeClasses =
    size === "large"
      ? "w-[112px] h-[112px]"
      : size === "admin"
        ? "w-[84px] h-[84px]"
        : "w-[84px] h-[84px] max-[800px]:w-[68px] max-[800px]:h-[68px]";

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 text-2xl font-extrabold tracking-wider leading-tight text-ink"
      aria-label={`${site.name} home`}
    >
      {site.logo &&
      ![
        "/brand/kimziz-logo.png",
        "/brand/kimziz-logo-transparent.png",
      ].includes(site.logo) ? (
        <img
          src={site.logo}
          alt={site.name}
          className={`${sizeClasses} object-contain bg-transparent dark:drop-shadow-[0_0_0.75px_rgba(255,255,255,0.9)]`}
        />
      ) : (
        <Image
          src="/brand/kimziz-logo-transparent.png"
          alt={site.name}
          width={size === "large" ? 112 : 84}
          height={size === "large" ? 112 : 84}
          className={`${sizeClasses} object-contain bg-transparent dark:drop-shadow-[0_0_0.75px_rgba(255,255,255,0.9)]`}
          priority
        />
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
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
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
      <a
        className="fixed top-0 left-5 z-[100] bg-gold text-navy p-3 -translate-y-[110%] focus:translate-y-0 transition-transform font-semibold text-sm"
        href="#main"
      >
        Skip to content
      </a>

      <div className="bg-navy text-[#d3dbe2] text-[0.64rem] tracking-[0.12em]">
        <div className="container flex justify-between items-center min-h-[34px] flex-wrap gap-2 text-[0.55rem] sm:text-[0.64rem]">
          <span className="flex items-center gap-2 sm:gap-3.5">
            IMPORTATION{" "}
            <i className="inline-block w-[3px] h-[3px] rounded-full bg-gold not-italic" />{" "}
            EXPORTATION{" "}
            <i className="inline-block w-[3px] h-[3px] rounded-full bg-gold not-italic" />{" "}
            CAR DEALINGS
          </span>
          <a
            href={`tel:${site.phone}`}
            className="text-[0.65rem] sm:text-[0.73rem] tracking-[0.08em] hover:text-gold transition-colors"
          >
            {site.phone}
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-20 bg-paper border-b border-line">
        <div className="container flex items-center justify-between min-h-[78px] md:min-h-[94px] gap-6">
          <Brand site={site} />

          <nav
            id="mobile-nav"
            className={`${
              open
                ? "flex flex-col absolute top-[78px] left-0 right-0 bg-paper border-b border-line p-6 shadow-xl gap-1 md:static md:flex-row md:items-center md:gap-7 md:p-0 md:border-0 md:shadow-none"
                : "hidden md:flex md:items-center md:gap-7"
            }`}
            aria-label="Main navigation"
          >
            {links.map(([url, label]) => {
              const isActive = path === url;
              return (
                <Link
                  href={url}
                  key={url}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm py-3.5 transition-colors font-medium ${
                    isActive
                      ? "text-ink border-l-2 md:border-l-0 md:border-b-2 border-gold pl-3 md:pl-0"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              className="w-11 h-11 grid place-items-center bg-transparent border-0 rounded hover:bg-soft text-ink transition-colors cursor-pointer"
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={toggleTheme}
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <Enquiry
              site={site}
              className="hidden lg:inline-flex items-center justify-center gap-3 min-h-[42px] px-4 py-2 bg-gold text-navy border border-gold rounded-[3px] text-xs font-semibold whitespace-nowrap hover:bg-gold-hover hover:border-gold-hover transition-colors cursor-pointer"
            />
            <button
              className="md:hidden w-11 h-11 grid place-items-center bg-transparent border-0 rounded hover:bg-soft text-ink transition-colors cursor-pointer"
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

      <footer className="pt-16 pb-8 bg-soft border-t border-line text-ink">
        <div className="container grid grid-cols-1 md:grid-cols-[1.5fr_0.8fr_1fr] gap-10 md:gap-16 pb-14">
          <div>
            <Brand site={site} size="large" />
            <p className="text-xs text-muted max-w-[320px] mt-4 leading-relaxed">
              {site.footer}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4 text-ink uppercase tracking-wider">
              Explore
            </h3>
            {links.slice(1).map(([url, label]) => (
              <Link
                key={url}
                href={url}
                className="block text-sm text-muted hover:text-ink mb-2.5 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4 text-ink uppercase tracking-wider">
              Get in touch
            </h3>
            <a
              href={`tel:${site.phone}`}
              className="block text-sm text-muted hover:text-ink mb-2 transition-colors"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="block text-sm text-muted hover:text-ink mb-2 transition-colors"
            >
              {site.email}
            </a>
            <p className="text-xs text-muted mt-3 max-w-[280px] leading-relaxed">
              {site.address}
            </p>
            {site.hours && (
              <p className="text-xs text-muted mt-1 max-w-[280px] leading-relaxed">
                {site.hours}
              </p>
            )}
          </div>
        </div>

        <div className="container flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-line text-[0.65rem] text-muted">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>{site.registration}</span>
          <div className="flex items-center gap-4">
            {site.social.map((s) => (
              <a
                key={s.url}
                href={s.url}
                rel="noopener noreferrer"
                target="_blank"
                className="text-muted hover:text-ink transition-colors"
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
