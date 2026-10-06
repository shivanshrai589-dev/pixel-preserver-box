import { createFileRoute } from "@tanstack/react-router";
import { clubQuery } from "@/lib/club-query";
import { seo } from "@/lib/club-schema";
import { Home } from "@/components/technexus/home";
import { ClubError, Loading } from "@/components/technexus/public-ui";
export const Route = createFileRoute("/")({
  head: ({ loaderData }) => {
    const base = seo(
      "TechNexus | Chandigarh University",
      "A student-driven AIT-CSE technical community at Chandigarh University. Learn, build, collaborate, and turn ideas into real-world impact.",
    );
    const code = (loaderData as Record<string, { data: Record<string, string> }[]> | undefined)?.[
      "site_settings"
    ]?.[0]?.data["google_verification"]?.trim();
    return code && /^[\w-]{10,100}$/.test(code)
      ? { ...base, meta: [...(base.meta ?? []), { name: "google-site-verification", content: code }] }
      : base;
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(clubQuery),
  component: Home,
  errorComponent: ClubError,
  notFoundComponent: ClubError,
  pendingComponent: Loading,
});
