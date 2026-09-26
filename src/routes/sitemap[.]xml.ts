import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const STATIC = ["/", "/fahrzeuge", "/auto-verkaufen", "/leistungen", "/finanzierung", "/ueber-uns", "/kontakt", "/impressum", "/datenschutz"];
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const base = (process.env["SITE_URL"] || new URL(request.url).origin).replace(/\/$/, "");
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
        const sb = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization"); h.set("apikey", key); return fetch(input, { ...init, headers: h }); } },
        });
        const all: { slug: string; updated_at: string }[] = [];
        for (let from = 0; ; from += 1000) {
          const { data, error } = await sb.from("vehicles").select("slug, updated_at").neq("status", "verkauft").order("id").range(from, from + 999);
          if (error) return new Response("sitemap_error", { status: 500 });
          all.push(...data);
          if (data.length < 1000) break;
        }
        const urls = [
          ...STATIC.map((p) => `<url><loc>${esc(base + p)}</loc></url>`),
          ...all.map((v) => `<url><loc>${esc(`${base}/fahrzeuge/${v.slug}`)}</loc><lastmod>${v.updated_at.slice(0, 10)}</lastmod></url>`),
        ];
        return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
