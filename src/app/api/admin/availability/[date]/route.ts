import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminFetch } from "@/app/api/_backend";

type Context = { params: Promise<{ date: string }> };

export async function PUT(req: NextRequest, { params }: Context) {
  const { date } = await params;
  const body = await req.text();

  const res = await adminFetch(`/api/admin/availability/${date}`, {
    method: "PUT",
    body,
    headers: { "Content-Type": "application/json" },
  });

  return new NextResponse(null, { status: res.status });
}




