import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/club-schema";
import { ApplicationForm } from "@/components/technexus/application-form";
export const Route = createFileRoute("/join")({
  head: () =>
    seo(
      "Join TechNexus",
      "Apply to join the TechNexus student technical community at Chandigarh University.",
    ),
  component: () => <ApplicationForm kind="join" />,
});
