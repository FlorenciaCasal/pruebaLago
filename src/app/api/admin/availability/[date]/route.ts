import { adminFetch } from "@/app/api/_backend";
import { NextRequest } from "next/server";

export async function PUT(_req: NextRequest, { params }: { params: { date: string } }
) {
  const body = await _req.text();
  const res = await adminFetch(`/api/admin/availability/${params.date}`, {
    method: "PUT",
    body,
    headers: { "Content-Type": "application/json" },
  });
  return new Response(null, { status: res.status });
}

// export async function POST(_req: NextRequest, { params }: { params: { id: string } }
// ) {
//   const res = await adminFetch(`/api/admin/reservations/${params.id}/cancel`, { method: "POST" });
//   const body = await res.text();
//   return new Response(body, {
//     status: res.status,
//     headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
//   });
// }

