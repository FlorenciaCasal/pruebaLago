import { adminFetch } from "@/app/api/_backend";
import type { NextRequest } from "next/server";

type Ctx = { params: { date: string } };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { date } = ctx.params;
  const body = await req.text();

  const upstream = await adminFetch(`/api/admin/availability/${date}`, {
    method: "PUT",
    body,
    headers: { "Content-Type": "application/json" },
  });

  return new Response(null, { status: upstream.status });
}
