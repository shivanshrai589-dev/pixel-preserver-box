import { createFileRoute } from "@tanstack/react-router";
import { clubQuery } from "@/lib/club-query";
import { seo } from "@/lib/club-schema";
import { Home } from "@/components/technexus/home";
import { ClubError, Loading } from "@/components/technexus/public-ui";
export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "TechNexus | Chandigarh University",
      "A student-driven AIT-CSE technical community at Chandigarh University. Learn, build, collaborate, and turn ideas into real-world impact.",
    ),
  loader: ({ context }) => context.queryClient.ensureQueryData(clubQuery),
  component: Home,
  errorComponent: ClubError,
  notFoundComponent: ClubError,
  pendingComponent: Loading,
});
