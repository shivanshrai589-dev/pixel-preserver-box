import { createFileRoute } from "@tanstack/react-router";
import { Admin } from "@/components/technexus/admin";
import { seo } from "@/lib/club-schema";
export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({
    meta: [
      ...seo("Admin settings", "Manage TechNexus club records securely.").meta,
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <Admin table="site_settings" />,
});
