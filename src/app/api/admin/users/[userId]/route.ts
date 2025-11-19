// import { adminFetch } from "@/app/api/_backend";
import { backendFetch } from "@/app/api/_backend";
import { NextRequest } from "next/server";


export async function PUT(
    _req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    const body = await _req.json();
    // const res = await adminFetch(`/api/admin/users/${userId}`, {
     const res = await backendFetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
    // UpdateUserRequest

    if (!res.ok) return new Response(null, { status: res.status });
    return new Response(body, {
        status: res.status,
        headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
    });
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    // const res = await adminFetch(`/api/admin/users/${userId}`, {
    const res = await backendFetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
    });
    return new Response(null, { status: res.status });
}
