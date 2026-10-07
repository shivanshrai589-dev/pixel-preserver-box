import { createFileRoute } from "@tanstack/react-router";

import { clubQuery } from "@/lib/club-query";

import {
  CollectionPage,
  ClubError,
  Loading,
} from "@/components/technexus/public-ui";

export const Route = createFileRoute("/events/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(clubQuery),

  component: () => <CollectionPage type="events" />,

  errorComponent: ClubError,

  notFoundComponent: ClubError,

  pendingComponent: Loading,
});
