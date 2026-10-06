import { createFileRoute } from "@tanstack/react-router";
import { Admin } from "@/components/technexus/admin";
import { seo } from "@/lib/club-schema";
export const Route = createFileRoute("/_authenticated/admin/members")({
  head: () => ({
    meta: [
      ...seo("Admin members", "Manage TechNexus club records securely.").meta,
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <Admin table="members" />,
});
