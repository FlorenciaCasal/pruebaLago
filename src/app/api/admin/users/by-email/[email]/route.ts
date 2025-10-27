import { adminFetch } from "@/app/api/_backend";
import { NextRequest } from "next/server";


// GET /api/admin/users/[email] -> proxy directo al backend (busca por email)
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ email: string }> }
) {

    const { email } = await params;
    const res = await adminFetch(`/api/admin/users/${encodeURIComponent(email)}`);
    // devolvemos tal cual el status del backend
    const text = await res.text();
    return new Response(text, { status: res.status, headers: { "content-type": res.headers.get("content-type") ?? "application/json" } });
}


// DELETE /api/admin/users/[email] -> lookup por email y luego delete por ID (UUID)
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ email: string }> }
) {
    const { email } = await params;

    // 1) Buscar usuario por email
    const lookup = await adminFetch(`/api/admin/users/${encodeURIComponent(email)}`);
    if (lookup.status === 404) return new Response(null, { status: 404 });
    if (!lookup.ok) return new Response(null, { status: lookup.status });

    const user = await lookup.json(); // debe traer { id: "...", ... }
    if (!user?.id) {
        // Por si el backend no devuelve id por alguna razón
        return new Response(JSON.stringify({ error: "El usuario no tiene campo de identificación." }), { status: 500 });
    }

    // 2) Borrar por UUID
    const del = await adminFetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    return new Response(null, { status: del.status });
}


