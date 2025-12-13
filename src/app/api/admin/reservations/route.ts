import type { NextRequest } from "next/server";
import { backendFetch } from "@/app/api/_backend";

const ALLOWED = new Set(["PENDING", "CONFIRMED", "CANCELLED"]);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sp = url.searchParams;

  // Normalizar/barrer el status
  const raw = sp.get("status");
  const status = raw?.toUpperCase();
  if (!status || status === "ALL" || !ALLOWED.has(status)) {
    sp.delete("status");            // ← clave: no enviar ALL al backend
  } else {
    sp.set("status", status);       // por si llega en minúsculas
  }

  const qs = sp.toString();
  const resp = await backendFetch(`/api/admin/reservations${qs ? `?${qs}` : ""}`, {
    headers: { "Content-Type": "application/json" },
  });

  const text = await resp.text();
  return new Response(text, {
    status: resp.status,
    headers: {
      "content-type": resp.headers.get("content-type") ?? "application/json",
    },
  });
}

