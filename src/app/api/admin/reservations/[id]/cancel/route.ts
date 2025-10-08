import { NextRequest } from "next/server";
import { adminFetch } from "@/app/api/_backend";

export async function POST(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const res = await adminFetch(`/api/admin/reservations/${params.id}/cancel`, { method: "POST" });
    const body = await res.text();
    return new Response(body, {
        status: res.status,
        headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
    });
}
