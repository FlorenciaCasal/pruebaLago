// import { adminFetch } from "@/app/api/_backend";
import { backendFetch } from "@/app/api/_backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const res = await backendFetch("/api/admin/users");
    const json = await res.json();
    return Response.json(json);
}

export async function POST(req: NextRequest) {
    const bodyText = await req.text(); // pasamos el cuerpo tal cual
    const resp = await backendFetch("/api/admin/users", {
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

