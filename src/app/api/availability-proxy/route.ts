export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  if (!month) {
    return new Response(JSON.stringify({ message: "month requerido" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const upstream = await fetch(`${API}/api/availability?month=${encodeURIComponent(month)}`, {
    cache: "no-store",
  });

  // Passthrough del cuerpo (por si el server no marca content-type como json)
  const body = await upstream.text();
  const contentType = upstream.headers.get("content-type") ?? "application/json";
  return new Response(body, { status: upstream.status, headers: { "content-type": contentType }});
}
