import { createFileRoute } from "@tanstack/react-router";

// Liefert Fahrzeugbilder aus dem privaten Bucket "vehicle-images" öffentlich aus.
// Der Bucket bleibt privat; der Zugriff läuft serverseitig über den Admin-Client.
// Nur Dateien direkt unter <fahrzeug-id>/<datei>.<ext> sind erlaubt.

const PATH_RE = /^[0-9a-f-]{36}\/[A-Za-z0-9._-]{1,120}\.(webp|jpg|jpeg|png)$/i;

const CONTENT_TYPES: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

export const Route = createFileRoute("/api/public/vehicle-image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const path = url.searchParams.get("path") ?? "";
        if (!PATH_RE.test(path) || path.includes("..")) {
          return new Response("Ungültiger Pfad", { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("vehicle-images").download(path);
        if (error || !data) {
          return new Response("Nicht gefunden", { status: 404 });
        }
        const ext = path.split(".").pop()?.toLowerCase() ?? "";
        return new Response(data, {
          headers: {
            "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
            "Cache-Control": "public, max-age=86400, s-maxage=604800",
          },
        });
      },
    },
  },
});
