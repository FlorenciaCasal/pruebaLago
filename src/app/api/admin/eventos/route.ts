import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/app/api/_backend";

// POST /api/admin/eventos  ->  proxy a /api/admin/eventos (Spring)
export async function POST(req: NextRequest) {
    const bodyText = await req.text(); // pasamos el cuerpo tal cual
    const resp = await adminFetch(`/api/admin/eventos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyText,
    });

    const text = await resp.text();
    // devolvemos el mismo status y content-type del backend
    return new NextResponse(text, {
        status: resp.status,
        headers: { "content-type": resp.headers.get("content-type") ?? "application/json" },
    });
}
