import { createFileRoute } from "@tanstack/react-router";
import { Admin } from "@/components/technexus/admin";
import { seo } from "@/lib/club-schema";
export const Route = createFileRoute("/_authenticated/admin/core-team")({
  head: () => ({
    meta: [
      ...seo("Admin core-team", "Manage TechNexus club records securely.").meta,
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <Admin table="core_members" />,
});
