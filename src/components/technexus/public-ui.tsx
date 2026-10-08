import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Code2,
  LoaderCircle,
  MapPin,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clubQuery } from "@/lib/club-query";
import type { RecordRow } from "@/lib/club-schema";

export function PageHeading({
  title,
  description,
  eyebrow = "THE TECHNEXUS COMMUNITY",
}: {
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <section className="border-b border-border bg-[#061126] py-20 text-white md:py-28">
      <div className="container-wide">
        <div className="text-xs font-semibold tracking-[0.2em] text-[#eab83f]">
          {eyebrow}
        </div>

        <h1 className="mt-5 max-w-5xl text-5xl font-bold tracking-[-0.05em] md:text-7xl">
          {title}
        </h1>

        <p className="mt-7 max-w-2xl border-l border-[#eab83f] pl-5 text-lg leading-8 text-white/60">
          {description}
        </p>
      </div>
    </section>
  );
}

export function Empty({ type }: { type: string }) {
  return (
    <div className="border-y border-border py-16">
      <div className="flex items-start gap-5">
        <div className="mt-1 text-primary">
          {type === "events" ? (
            <CalendarDays />
          ) : type === "activities" ? (
            <Code2 />
          ) : (
            <Users />
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold tracking-[-0.02em]">
            {type === "events"
              ? "The next chapter is on its way."
              : type === "activities"
                ? "Something worth building is coming."
                : "Meet the community, soon."}
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            {type === "events"
              ? "New events will appear here when announced."
              : type === "activities"
                ? "Activities will appear here when the club publishes them."
                : "Member profiles will appear here as the team adds them."}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <LoaderCircle
        className="size-7 animate-spin text-primary"
        aria-label="Loading club content"
      />
    </div>
  );
}

export function ClubError() {
  return (
    <div className="section container-wide">
      <div className="border-y border-border py-16">
        <h2 className="text-3xl font-bold">
          We couldn’t load this page.
        </h2>

        <p className="mt-3 text-muted-foreground">
          Please refresh and try again.
        </p>

        <Button
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

export function SafeImage({
  src,
  alt,
  className,
}: {
  src?: string | undefined;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return src && !failed ? (
    <img
      src={src}
      alt={alt}
      className={
        className ??
        "h-full w-full object-cover grayscale-[15%] transition duration-500 group-hover:grayscale-0"
      }
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="flex aspect-[4/5] items-center justify-center bg-[#e8ebef] text-muted-foreground">
      <UserRound
        className="size-12"
        strokeWidth={1}
        aria-label="Profile image not provided"
      />
    </div>
  );
}

export function PersonCard({ row }: { row: RecordRow }) {
  const d = row.data;

  return (
    <article className="group bg-background">
      <div className="aspect-[4/5] overflow-hidden bg-[#e8ebef]">
        <SafeImage
          src={d["image"]}
          alt={d["name"] ?? "Core Member"}
        />
      </div>

      <div className="border-t border-border px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-[-0.02em]">
              {d["name"] ?? "Core Member"}
            </h3>

            {d["position"] && (
              <p className="mt-1 text-sm text-primary">
                {d["position"]}
              </p>
            )}
          </div>

          <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>

        {d["department"] && (
          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {d["department"]}
            {d["year"] && ` · Year ${d["year"]}`}
          </p>
        )}

        {d["bio"] && (
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {d["bio"]}
          </p>
        )}

        {d["skills"] && (
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            {d["skills"]}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-4">
          {["linkedin", "github"].map(
            (k) =>
              safeUrl(d[k]) && (
                <a
                  key={k}
                  href={safeUrl(d[k])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold underline underline-offset-4"
                >
                  {k === "github" ? "GitHub" : "LinkedIn"}
                </a>
              ),
          )}

          {d["email"] && (
            <a
              href={`mailto:${d["email"]}`}
              className="text-xs font-semibold underline underline-offset-4"
            >
              Email
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function EventCard({ row }: { row: RecordRow }) {
  const d = row.data;

  return (
    <article className="group bg-white text-[#061126]">
      {d["image"] ? (
        <div className="aspect-[16/10] overflow-hidden">
          <SafeImage
            src={d["image"]}
            alt={d["title"] ?? "TechNexus event"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center bg-[#0b1931]">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#eab83f]">
            TECHNEXUS EVENT
          </span>
        </div>
      )}

      <div className="p-6 md:p-7">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b28718]">
          {d["category"] ?? "Event"} · {row.status}
        </div>

        <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em]">
          {d["title"]}
        </h3>

        {d["date"] && (
          <p className="mt-5 flex items-center gap-2 text-sm text-[#061126]/60">
            <CalendarDays className="size-4" />
            {d["date"]}
          </p>
        )}

        {d["venue"] && (
          <p className="mt-2 flex items-center gap-2 text-sm text-[#061126]/60">
            <MapPin className="size-4" />
            {d["venue"]}
          </p>
        )}

        <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#061126]/65">
          {d["description"]}
        </p>

        <Button
          asChild
          variant="link"
          className="mt-5 px-0 text-[#061126]"
        >
          <Link to="/events/$id" params={{ id: row.id }}>
            View event
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function CollectionPage({
  type,
}: {
  type: "members" | "core_members" | "activities" | "events";
}) {
  const { data } = useSuspenseQuery(clubQuery);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const title = {
    members: "Find your people.",
    core_members: "The minds behind the momentum.",
    activities: "Learn. Build. Repeat.",
    events: "Meet ideas in motion.",
  }[type];

  const description = {
    members:
      "A community of curious minds, each bringing a different perspective.",
    core_members:
      "The students shaping TechNexus, one idea at a time.",
    activities:
      "Hands-on experiences that take curiosity beyond the classroom.",
    events:
      "Discover what’s next in the TechNexus community.",
  }[type];

  const categories = (
    data["site_settings"]?.[0]?.data["categories"] ?? ""
  )
    .split(",")
    .filter(Boolean);

  const rows = (data[type] ?? []).filter(
    (r) =>
      normalize(
        `${r.data["name"] ?? ""} ${r.data["title"] ?? ""} ${r.data["position"] ?? ""} ${r.data["skills"] ?? ""} ${r.data["description"] ?? ""} ${r.data["category"] ?? ""}`,
      ).includes(normalize(search)) &&
      (category === "All" ||
        r.data["category"] === category ||
        r.data["department"] === category) &&
      (status === "All" || r.status === status),
  );

  return (
    <>
      <PageHeading
        title={title}
        description={description}
      />

      <section className="py-10 md:py-14">
        <div className="container-wide">
          {type !== "core_members" && (
            <div className="mb-12 flex flex-col gap-3 border-y border-border py-4 md:flex-row">
              <div className="relative w-full md:max-w-[320px]">
                <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />

                <input
                  aria-label="Search"
                  className="field-input pl-9"
                  placeholder={`Search ${type}…`}
                  value={search}
                  maxLength={100}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                aria-label={
                  type === "members"
                    ? "Filter by department"
                    : "Filter by category"
                }
                className="field-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">
                  All{" "}
                  {type === "members"
                    ? "departments"
                    : "categories"}
                </option>

                {(type === "members"
                  ? Array.from(
                      new Set(
                        (data["members"] ?? [])
                          .map((r) => r.data["department"])
                          .filter(Boolean),
                      ),
                    )
                  : categories
                ).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              {type === "events" && (
                <select
                  aria-label="Filter by status"
                  className="field-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {[
                    "All",
                    "Upcoming",
                    "Ongoing",
                    "Completed",
                    "Cancelled",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s === "All" ? "All statuses" : s}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {!rows.length ? (
            <Empty type={type} />
          ) : (
            <div
              className={
                type === "members" || type === "core_members"
                  ? "grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3"
                  : type === "events"
                    ? "grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-3"
                    : "divide-y divide-border border-y border-border"
              }
            >
              {rows.map((row, index) =>
                type === "members" || type === "core_members" ? (
                  <PersonCard key={row.id} row={row} />
                ) : type === "events" ? (
                  <EventCard key={row.id} row={row} />
                ) : (
                  <article
                    key={row.id}
                    className="grid gap-5 py-8 md:grid-cols-[80px_1fr_2fr_auto] md:items-center"
                  >
                    <span className="text-sm font-semibold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      {row.data["image"] && (
                        <div className="mb-4 h-24 w-32 overflow-hidden">
                          <SafeImage
                            src={row.data["image"]}
                            alt={
                              row.data["title"] ??
                              "TechNexus activity"
                            }
                          />
                        </div>
                      )}

                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {row.data["category"]}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold tracking-[-0.025em]">
                        {row.data["title"]}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {row.data["description"]}
                      </p>

                      {row.data["date"] && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          {row.data["date"]}
                        </p>
                      )}
                    </div>

                    {row.data["link"] && (
                      <Button
                        variant="link"
                        asChild
                        className="px-0"
                      >
                        <a
                          href={safeUrl(row.data["link"])}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Explore
                          <ArrowUpRight />
                        </a>
                      </Button>
                    )}
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export const normalize = (v: string) =>
  v.toLowerCase().replace(/\s+/g, " ").trim();

export function safeUrl(v?: string) {
  if (!v) return undefined;

  try {
    const u = new URL(v);

    return u.protocol === "https:"
      ? u.toString()
      : undefined;
  } catch {
    return undefined;
  }
}
