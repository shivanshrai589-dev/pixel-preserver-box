import { createFileRoute } from "@tanstack/react-router";
import { getPublicClub } from "@/lib/club.functions";
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const data = await getPublicClub();
        const origin = new URL(request.url).origin;
        const paths = [
          "/",
          "/about",
          "/activities",
          "/members",
          "/core-team",
          "/events",
          "/volunteer",
          "/join",
          "/contact",
          ...(data["events"] ?? []).map((r) => `/events/${r.id}`),
        ];
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${origin}${p}</loc></url>`).join("")}</urlset>`,
          { headers: { "Content-Type": "application/xml" } },
        );
      },
    },
  },
});
