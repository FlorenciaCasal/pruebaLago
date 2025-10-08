import { NextRequest } from "next/server";
import { adminFetch } from "../../_backend";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");   // YYYY-MM-DD
  const status = req.nextUrl.searchParams.get("status");
  const qs = new URLSearchParams();
  if (date) qs.set("date", date);
  if (status) qs.set("status", status);

  const res = await adminFetch(`/api/admin/reservations${qs.toString() ? `?${qs}` : ""}`);
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}
