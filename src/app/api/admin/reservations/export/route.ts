import { NextRequest } from "next/server";
// import { adminFetch } from "@/app/api/_backend";
import { backendFetch } from "@/app/api/_backend";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const qs = url.search; // ?date=YYYY-MM-DD&status=...&visitorType=...&mask=true
  const res = await backendFetch(`/api/admin/reservations/export${qs}`, { method: "GET" });

  // Pasamos el archivo tal cual, con headers de tipo y disposición si vienen del back
  const body = await res.arrayBuffer();
  const headers = new Headers();
  headers.set(
    "content-type",
    res.headers.get("content-type") ?? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  const cd = res.headers.get("content-disposition");
  if (cd) headers.set("content-disposition", cd);

  return new Response(body, { status: res.status, headers });
}

