import { createFileRoute } from "@tanstack/react-router";
import { Auth } from "@/components/technexus/auth";
import { seo } from "@/lib/club-schema";
export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      ...seo("Secure sign in", "Secure TechNexus administrator access.").meta,
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Auth,
});
