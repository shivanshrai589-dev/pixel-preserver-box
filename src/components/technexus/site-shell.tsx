import { safeUrl } from "./public-ui";

import {
  Link,
  useRouterState,
} from "@tanstack/react-router";

import { useEffect, useState } from "react";

import {
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import logo from "@/assets/technexus-logo.png.asset.json";

import { useQuery } from "@tanstack/react-query";

import { clubQuery } from "@/lib/club-query";

import { supabase } from "@/integrations/supabase/client";

const nav = [
  ["/", "Home"],
  ["/about", "About"],
  ["/activities", "Activities"],
  ["/members", "Members"],
  ["/core-team", "Core Team"],
  ["/events", "Events"],
  ["/volunteer", "Volunteer"],
] as const;

export function Brand() {
  return (
    <Link
      to="/"
      className="brand tn-brand"
      aria-label="TechNexus home"
    >
      <img
        src={logo.url}
        alt="Official TechNexus Chandigarh University AIT-CSE logo"
      />

      <div>
        <div className="brand-name">
          TechNexus
          <span className="text-primary">.</span>
        </div>

        <div className="brand-sub">
          Chandigarh University · AIT-CSE
        </div>
      </div>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const path = useRouterState({
    select: (s) => s.location.pathname,
  });

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    void supabase.auth
      .getUser()
      .then(({ data }) => {
        setSignedIn(!!data.user);
      });
  }, [path]);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      close,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        close,
      );
    };
  }, []);

  return (
    <header className="site-header tn-site-header">
      <div className="container-wide header-inner">
        <Brand />

        <nav
          className="desktop-nav tn-desktop-nav"
          aria-label="Main navigation"
        >
          {nav.map(([to, name]) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true }}
              className="nav-link tn-nav-link"
            >
              {name}
            </Link>
          ))}

          {signedIn && (
            <Link
              to="/admin"
              className="nav-link tn-nav-link"
            >
              My account
            </Link>
          )}
        </nav>

        <Button
          asChild
          className="header-cta tn-header-cta"
          size="sm"
        >
          <Link to="/join">
            Join TechNexus
            <ArrowUpRight />
          </Link>
        </Button>

        <Button
          className="menu-toggle tn-menu-toggle"
          variant="ghost"
          size="icon"
          aria-label={
            open
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() =>
            setOpen(!open)
          }
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav tn-mobile-nav"
          aria-label="Mobile navigation"
        >
          {nav.map(([to, name]) => (
            <Link
              key={to}
              to={to}
            >
              {name}
            </Link>
          ))}

          {signedIn && (
            <Link to="/admin">
              My account
            </Link>
          )}

          <Link to="/join">
            Join TechNexus
            <ArrowUpRight className="inline size-4" />
          </Link>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { data } =
    useQuery(clubQuery);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = mounted
    ? data?.["club_content"]?.[0]?.data
    : undefined;

  const settings = mounted
    ? data?.["site_settings"]?.[0]?.data
    : undefined;

  return (
    <footer className="site-footer tn-site-footer">
      <div className="container-wide">
        <div className="footer-main">
          <div className="footer-about">
            <Brand />

            <p>
              {content?.["footer"] ??
                "A student-driven technical community at Chandigarh University. Learn together. Build together. Go further."}
            </p>

            {settings?.["email"] && (
              <a
                href={`mailto:${settings["email"]}`}
                className="block text-xs mt-3"
              >
                {settings["email"]}
              </a>
            )}

            {settings?.["phone"] && (
              <p>
                {settings["phone"]}
              </p>
            )}

            {settings?.["address"] && (
              <p>
                {settings["address"]}
              </p>
            )}

            <div className="flex gap-4 mt-4">
              {[
                "linkedin",
                "github",
                "instagram",
              ].map(
                (key) =>
                  safeUrl(
                    settings?.[key],
                  ) && (
                    <a
                      key={key}
                      href={safeUrl(
                        settings?.[key],
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline"
                    >
                      {key}
                    </a>
                  ),
              )}
            </div>
          </div>

          <div className="footer-links">
            <div>
              <h3>Explore</h3>

              <Link to="/about">
                About us
              </Link>

              <Link to="/activities">
                Activities
              </Link>

              <Link to="/events">
                Events
              </Link>

              <Link to="/core-team">
                Core team
              </Link>
            </div>

            <div>
              <h3>Get involved</h3>

              <Link to="/join">
                Join TechNexus
              </Link>

              <Link to="/volunteer">
                Volunteer
              </Link>

              <Link to="/contact">
                Contact us
              </Link>

              <Link to="/admin/login">
                Admin access
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} TechNexus · Chandigarh University
          </span>

          <span>
            Department of AIT-CSE · Innovate. Collaborate. Elevate.
          </span>
        </div>
      </div>
    </footer>
  );
}
