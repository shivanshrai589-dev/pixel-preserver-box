import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { clubQuery } from "@/lib/club-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/technexus-logo.png.asset.json";

import { safeUrl } from "./public-ui";

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
      className="group flex items-center gap-3"
      aria-label="TechNexus home"
    >
      <img
        src={logo.url}
        alt="Official TechNexus Chandigarh University AIT-CSE logo"
        className="h-12 w-12 object-contain"
      />

      <div>
        <div className="text-[1.2rem] font-bold tracking-[-0.035em]">
          TechNexus
          <span className="text-primary">.</span>
        </div>

        <div className="hidden text-[9px] font-semibold uppercase tracking-[0.13em] text-muted-foreground sm:block">
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
      .then(({ data }) => setSignedIn(!!data.user));
  }, [path]);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", close);

    return () => {
      window.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-wide flex h-[76px] items-center justify-between gap-6">
        <Brand />

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Main navigation"
        >
          {nav.map(([to, name]) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true }}
              className="text-[13px] font-semibold text-foreground/75 transition hover:text-foreground"
            >
              {name}
            </Link>
          ))}

          {signedIn && (
            <Link
              to="/admin"
              className="text-[13px] font-semibold text-muted-foreground transition hover:text-foreground"
            >
              My account
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="hidden bg-primary text-primary-foreground sm:flex"
          >
            <Link to="/join">
              Join TechNexus
              <ArrowUpRight />
            </Link>
          </Button>

          <Button
            className="lg:hidden"
            variant="ghost"
            size="icon"
            aria-label={
              open ? "Close menu" : "Open menu"
            }
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-navigation"
          className="border-t border-border bg-background px-6 py-5 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="container-wide flex flex-col">
            {nav.map(([to, name]) => (
              <Link
                key={to}
                to={to}
                className="border-b border-border py-4 text-base font-semibold"
              >
                {name}
              </Link>
            ))}

            {signedIn && (
              <Link
                to="/admin"
                className="border-b border-border py-4 text-base font-semibold"
              >
                My account
              </Link>
            )}

            <Link
              to="/join"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-primary"
            >
              Join TechNexus
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { data } = useQuery(clubQuery);

  const [mounted, setMounted] = useState(false);

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
    <footer className="border-t border-border bg-[#061126] text-white">
      <div className="container-wide">
        <div className="grid gap-14 py-16 md:grid-cols-[1.4fr_.6fr_.6fr] md:py-20">
          <div className="max-w-md">
            <Brand />

            <p className="mt-7 text-sm leading-7 text-white/55">
              {content?.["footer"] ??
                "A student-driven technical community at Chandigarh University. Learn together. Build together. Go further."}
            </p>

            {settings?.["email"] && (
              <a
                href={`mailto:${settings["email"]}`}
                className="mt-5 block text-sm text-white/70 underline underline-offset-4"
              >
                {settings["email"]}
              </a>
            )}

            {settings?.["phone"] && (
              <p className="mt-2 text-sm text-white/55">
                {settings["phone"]}
              </p>
            )}

            {settings?.["address"] && (
              <p className="mt-2 text-sm text-white/55">
                {settings["address"]}
              </p>
            )}

            <div className="mt-7 flex gap-5">
              {["linkedin", "github", "instagram"].map(
                (key) =>
                  safeUrl(settings?.[key]) && (
                    <a
                      key={key}
                      href={safeUrl(settings?.[key])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60 transition hover:text-[#eab83f]"
                    >
                      {key}
                    </a>
                  ),
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#eab83f]">
              Explore
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-sm text-white/60">
              <Link to="/about">About us</Link>
              <Link to="/activities">Activities</Link>
              <Link to="/events">Events</Link>
              <Link to="/members">Members</Link>
              <Link to="/core-team">Core team</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#eab83f]">
              Get involved
            </h3>

            <div className="mt-6 flex flex-col gap-4 text-sm text-white/60">
              <Link to="/join">Join TechNexus</Link>
              <Link to="/volunteer">Volunteer</Link>
              <Link to="/contact">Contact us</Link>
              <Link to="/admin/login">Admin access</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-white/10 py-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35 md:flex-row">
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
