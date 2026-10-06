import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/club-schema";
import { ApplicationForm } from "@/components/technexus/application-form";
export const Route = createFileRoute("/volunteer")({
  head: () => seo("Volunteer", "Apply to volunteer and help shape the TechNexus community."),
  component: () => <ApplicationForm kind="volunteer" />,
});
