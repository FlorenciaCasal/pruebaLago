import { adminFetch } from "@/app/api/_backend";
import { NextResponse } from "next/server";

type Context = { params: { date: string } };

export async function PUT(req: Request, { params }: Context) {
  const body = await req.text();

  const res = await adminFetch(`/api/admin/availability/${params.date}`, {
    method: "PUT",
    body,
    headers: { "Content-Type": "application/json" },
  });

  return new NextResponse(null, { status: res.status });
}



