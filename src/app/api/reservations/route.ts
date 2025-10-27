import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
    const body = await req.text();

    console.log("RESERVATION BODY:", body);

    const r = await fetch(`${API}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
    });
    const text = await r.text();

    console.log("BACK RESPONSE:", r.status, text);

    return new NextResponse(text, {
        status: r.status,
        headers: { "content-type": r.headers.get("content-type") ?? "application/json" }
    });
}


