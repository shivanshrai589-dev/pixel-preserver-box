import { createFileRoute } from "@tanstack/react-router";
import { Auth } from "@/components/technexus/auth";
import { seo } from "@/lib/club-schema";
export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      ...seo("Administrator sign in", "Secure TechNexus administrator access.").meta,
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Auth,
});
