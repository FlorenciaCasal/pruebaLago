// src/app/api/admin/booking-flags/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/app/api/_backend";

export const dynamic = "force-dynamic"; // evita cualquier cache

export async function GET() {
  const r = await adminFetch("/api/admin/config/educational-reservations", { cache: "no-store" });
  return new NextResponse(await r.text(), {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") ?? "application/json" }
  });
}

export async function PUT(req: NextRequest) {
  // Enviar {enabled: boolean}
  const body = await req.json().catch(() => ({}));
  const payload = JSON.stringify({ enabled: !!body.enabled });

  const r = await adminFetch("/api/admin/config/educational-reservations", {
    method: "PUT",
    body: payload,
    headers: { "Content-Type": "application/json" }
  });
  return new NextResponse(await r.text(), {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
  });
}


