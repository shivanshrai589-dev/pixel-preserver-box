import { createFileRoute } from "@tanstack/react-router";
import { AdminManagement } from "@/components/technexus/admin-management";
import { seo } from "@/lib/club-schema";

export const Route = createFileRoute("/_authenticated/admin/settings/admins")({
  head: () => ({
    meta: [
      ...seo("Admin management", "Manage TechNexus administrator access.").meta,
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminManagement,
});
