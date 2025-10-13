// import { NextRequest } from "next/server";
// import { adminFetch } from "../../_backend";

// export async function GET(req: NextRequest) {
//   const date = req.nextUrl.searchParams.get("date");   // YYYY-MM-DD
//   const status = req.nextUrl.searchParams.get("status");
//   const qs = new URLSearchParams();
//   if (date) qs.set("date", date);
//   if (status) qs.set("status", status);

//   const res = await adminFetch(`/api/admin/reservations${qs.toString() ? `?${qs}` : ""}`);
//   const body = await res.text();
//   return new Response(body, {
//     status: res.status,
//     headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
//   });
// }
// src/app/api/admin/reservations/route.ts
// import type { NextRequest } from "next/server";
// import { adminFetch } from "@/app/api/_backend";

// export async function GET(req: NextRequest) {
//   // Pasar query params (status, date, etc.)
//   const url = new URL(req.url);
//   const qs = url.search ? url.search : "";

//   // Llamá al backend SIEMPRE con adminFetch (Basic Auth)
//   const resp = await adminFetch(`/api/admin/reservations${qs}`, {
//     // acá no pasamos Authorization del usuario; usamos el Basic interno
//     headers: { "Content-Type": "application/json" },
//   });

//   const text = await resp.text();
//   return new Response(text, {
//     status: resp.status,
//     headers: {
//       "content-type": resp.headers.get("content-type") ?? "application/json",
//     },
//   });
// }
import type { NextRequest } from "next/server";
import { adminFetch } from "@/app/api/_backend";

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
  const resp = await adminFetch(`/api/admin/reservations${qs ? `?${qs}` : ""}`, {
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

