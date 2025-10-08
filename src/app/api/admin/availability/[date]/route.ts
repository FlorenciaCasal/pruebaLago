// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { adminFetch } from "@/app/api/_backend";

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { date: string } }
// ) {
//   const body = await req.text();

//   const res = await adminFetch(`/api/admin/availability/${params.date}`, {
//     method: "PUT",
//     body,
//     headers: { "Content-Type": "application/json" },
//   });

//   return new NextResponse(null, { status: res.status });
// }

import { adminFetch } from "@/app/api/_backend";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ date: string }> }   // ← importante: Promise<any>
) {
  const { date } = await params; // ← await
  const body = await req.text();

  const res = await adminFetch(`/api/admin/availability/${date}`, {
    method: "PUT",
    body,
    headers: { "Content-Type": "application/json" },
  });

  return new NextResponse(null, { status: res.status });
}



