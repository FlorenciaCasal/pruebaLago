import { NextResponse } from "next/server";
// import { adminFetch } from "@/app/api/_backend";
// import { backendFetch } from "@/app/api/_backend";
import { serviceFetch } from "@/app/api/_backend";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Llamamos al controller real del back (protegido) CON credenciales
    // const r = await backendFetch("/api/admin/config/educational-reservations", { cache: "no-store" });
    const r = await serviceFetch("/api/admin/config/educational-reservations", { cache: "no-store" });
    const text = await r.text();
    if (!r.ok) {
      return new NextResponse(text, { status: r.status, headers: { "content-type": r.headers.get("content-type") ?? "application/json" } });
    }

    const { enabled } = JSON.parse(text) as { enabled: boolean };

    // Mapeo a la forma que consume el front
    return NextResponse.json({ individualEnabled: true, schoolEnabled: enabled });
  } catch (e: unknown) {
    console.error("GET /api/booking-flags error:", e);
    return NextResponse.json({ message: "Proxy error" }, { status: 500 });
  }
}

