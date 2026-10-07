import { createFileRoute, Outlet } from "@tanstack/react-router";
import { clubQuery } from "@/lib/club-query";
import { seo } from "@/lib/club-schema";
import { ClubError, Loading } from "@/components/technexus/public-ui";

export const Route = createFileRoute("/events")({
  head: () => seo("Events", "Discover upcoming and past TechNexus community events."),
  loader: ({ context }) => context.queryClient.ensureQueryData(clubQuery),
  component: () => <Outlet />,
  errorComponent: ClubError,
  notFoundComponent: ClubError,
  pendingComponent: Loading,
});
