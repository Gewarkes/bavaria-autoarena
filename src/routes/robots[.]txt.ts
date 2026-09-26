import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const base = (process.env["SITE_URL"] || new URL(request.url).origin).replace(/\/$/, "");
        return new Response(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${base}/sitemap.xml\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      },
    },
  },
});
