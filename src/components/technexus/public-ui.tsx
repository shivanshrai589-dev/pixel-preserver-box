import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Users,
  UserRound,
  MapPin,
  Search,
  LoaderCircle,
  Code2,
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
    <section className="page-heading">
      <div className="container-wide">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
export function Empty({ type }: { type: string }) {
  return (
    <div className="empty">
      {type === "events" ? <CalendarDays /> : type === "activities" ? <Code2 /> : <Users />}
      <h3>
        {type === "events"
          ? "The next chapter is on its way."
          : type === "activities"
            ? "Something worth building is coming."
            : "Meet the community, soon."}
      </h3>
      <p>
        {type === "events"
          ? "New events will appear here when announced."
          : type === "activities"
            ? "Activities will appear here when the club publishes them."
            : "Member profiles will appear here as the team adds them."}
      </p>
    </div>
  );
}
export function Loading() {
  return (
    <div className="loading">
      <LoaderCircle className="spin" aria-label="Loading club content" />
    </div>
  );
}
export function ClubError() {
  return (
    <div className="section container-wide">
      <div className="empty">
        <h2>We couldn’t load this page.</h2>
        <p>Please refresh and try again.</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
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
  className?: string | undefined;
}) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <img
      src={src}
      alt={alt}
      className={className ?? "card-image"}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="avatar-placeholder">
      <UserRound aria-label="Profile image not provided" />
    </div>
  );
}
export function PersonCard({ row }: { row: RecordRow }) {
  const d = row.data;
  return (
    <article className="content-card">
      <SafeImage src={d["image"]} alt={d["name"] ?? "Core Member"} />
      <div className="content-card-body">
        <h3>{d["name"]}</h3>
        {d["position"] && <p>{d["position"]}</p>}
        {d["department"] && (
          <p>
            {d["department"]}
            {d["year"] && ` · Year ${d["year"]}`}
          </p>
        )}
        {d["bio"] && <p className="mt-3">{d["bio"]}</p>}
        {d["skills"] && <p className="mt-3">{d["skills"]}</p>}
        <div className="flex gap-4 mt-3">
          {["linkedin", "github"].map(
            (k) =>
              d[k] && (
                <a
                  key={k}
                  href={d[k]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline"
                >
                  {k === "github" ? "GitHub" : "LinkedIn"}
                </a>
              ),
          )}
          {d["email"] && (
            <a href={`mailto:${d["email"]}`} className="text-xs underline">
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
    <article className="content-card">
      {d["image"] && <SafeImage src={d["image"]} alt={d["title"] ?? "TechNexus event"} />}
      <div className="content-card-body">
        <div className="tag">
          {d["category"]} · {row.status}
        </div>
        <h3>{d["title"]}</h3>
        {d["date"] && (
          <p className="flex items-center gap-2 mb-2">
            <CalendarDays className="size-3" />
            {d["date"]}
          </p>
        )}
        {d["venue"] && (
          <p className="flex items-center gap-2">
            <MapPin className="size-3" />
            {d["venue"]}
          </p>
        )}
        <p className="line-clamp-3 mt-3">{d["description"]}</p>
        <Button asChild variant="link" className="px-0 mt-3">
          <Link to="/events/$id" params={{ id: row.id }}>
            View event <ArrowUpRight />
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
    members: "A community of curious minds, each bringing a different perspective.",
    core_members: "The students shaping TechNexus, one idea at a time.",
    activities: "Hands-on experiences that take curiosity beyond the classroom.",
    events: "Discover what’s next in the TechNexus community.",
  }[type];
  const categories = (data["site_settings"]?.[0]?.data["categories"] ?? "")
    .split(",")
    .filter(Boolean);
  const rows = (data[type] ?? []).filter(
    (r) =>
      `${r.data["name"] ?? ""} ${r.data["title"] ?? ""} ${r.data["skills"] ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (category === "All" ||
        r.data["category"] === category ||
        r.data["department"] === category) &&
      (status === "All" || r.status === status),
  );
  return (
    <>
      <PageHeading title={title} description={description} />
      <section className="section">
        <div className="container-wide">
          {type !== "core_members" && (
            <div className="filter-bar">
              <div className="relative w-full max-w-[280px]">
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
                aria-label={type === "members" ? "Filter by department" : "Filter by category"}
                className="field-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All {type === "members" ? "departments" : "categories"}</option>
                {(type === "members"
                  ? Array.from(
                      new Set(
                        (data["members"] ?? []).map((r) => r.data["department"]).filter(Boolean),
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
                  {["All", "Upcoming", "Ongoing", "Completed", "Cancelled"].map((s) => (
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
            <div className={`card-grid ${type === "core_members" ? "team-grid" : ""}`}>
              {rows.map((row) =>
                type === "members" || type === "core_members" ? (
                  <PersonCard key={row.id} row={row} />
                ) : type === "events" ? (
                  <EventCard key={row.id} row={row} />
                ) : (
                  <article key={row.id} className="content-card">
                    {row.data["image"] && (
                      <SafeImage
                        src={row.data["image"]}
                        alt={row.data["title"] ?? "TechNexus activity"}
                      />
                    )}
                    <div className="content-card-body">
                      <span className="tag">{row.data["category"]}</span>
                      <h3>{row.data["title"]}</h3>
                      <p>{row.data["description"]}</p>
                      {row.data["date"] && <p>{row.data["date"]}</p>}
                      {row.data['link'] && (
                        <Button variant="link" asChild className="px-0 mt-3">
                          <a href={row.data['link']} target="_blank" rel="noopener noreferrer">
                            Explore activity <ArrowUpRight />
                          </a>
                        </Button>
                      )}
                    </div>
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
