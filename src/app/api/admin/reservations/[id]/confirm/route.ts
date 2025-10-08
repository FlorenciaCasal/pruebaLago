import { NextRequest } from "next/server";
import { adminFetch } from "@/app/api/_backend";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await adminFetch(`/api/admin/reservations/${id}/confirm`, { method: "POST" });
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}

