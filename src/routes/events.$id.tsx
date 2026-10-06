import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { clubQuery } from "@/lib/club-query";
import { seo } from "@/lib/club-schema";
import {
  PageHeading,
  ClubError,
  Loading,
  EventCard,
  SafeImage,
} from "@/components/technexus/public-ui";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/events/$id")({
  head: ({ loaderData, params }) => {
    const r = loaderData?.["events"]?.find((x) => x.id === params.id);
    return seo(
      r?.data["title"] ?? "Event not found",
      r?.data["description"] ?? "This TechNexus event is not available.",
    );
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(clubQuery),
  component: EventDetail,
  errorComponent: ClubError,
  notFoundComponent: ClubError,
  pendingComponent: Loading,
});
function EventDetail() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(clubQuery);
  const row = data["events"]?.find((r) => r.id === id);
  if (!row)
    return (
      <section className="section container-wide">
        <div className="empty">
          <h1 className="section-title">This event isn’t in our orbit.</h1>
          <p>The event may have been removed or the link may be incorrect.</p>
          <Button asChild className="mt-5">
            <Link to="/events">Back to events</Link>
          </Button>
        </div>
      </section>
    );
  const d = row.data;
  return (
    <>
      <PageHeading
        title={d["title"] ?? "TechNexus event"}
        description={`${d["category"] ?? ""} · ${row.status}`}
        eyebrow="TECHNEXUS EVENTS"
      />
      <section className="section">
        <div className="container-wide">
          <div className="detail-body">
            {d["image"] && <SafeImage src={d["image"]} alt={d["title"] ?? "TechNexus event"} />}
            <div className="detail-meta">
              {d["date"] && (
                <span>
                  <CalendarDays className="size-4" />
                  {d["date"]}
                </span>
              )}
              {d["start_time"] && (
                <span>
                  <Clock className="size-4" />
                  {d["start_time"]}
                  {d["end_time"] && ` – ${d["end_time"]}`}
                </span>
              )}
              {d["venue"] && (
                <span>
                  <MapPin className="size-4" />
                  {d["venue"]}
                </span>
              )}
            </div>
            <p className="prose-text">{d["description"]}</p>
            {d["organizer"] && <p className="mt-6">Organised by {d["organizer"]}</p>}
            {d["speaker"] && <p className="mt-3">Speaker: {d["speaker"]}</p>}
            {d["registration_url"] && ["Upcoming", "Ongoing"].includes(row.status) && (
              <Button asChild size="lg" className="mt-8">
                <a href={d["registration_url"]} target="_blank" rel="noopener noreferrer">
                  Register for this event <ArrowUpRight />
                </a>
              </Button>
            )}
          </div>
          {(data["events"] ?? []).length > 1 && (
            <div className="mt-14">
              <h2 className="section-title">More in our orbit.</h2>
              <div className="card-grid">
                {(data["events"] ?? [])
                  .filter((r) => r.id !== id)
                  .slice(0, 3)
                  .map((r) => (
                    <EventCard row={r} key={r.id} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
