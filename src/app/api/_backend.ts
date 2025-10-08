const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function adminAuthHeader() {
  const u = process.env.ADMIN_USER || "admin";
  const p = process.env.ADMIN_PASS || "admin123";
  return "Basic " + Buffer.from(`${u}:${p}`).toString("base64");
}

export async function adminFetch(path: string, init: RequestInit = {}) {
  return fetch(`${BACKEND}${path}`, {
    ...init,
    headers: {
      Authorization: adminAuthHeader(),
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
}

export async function publicFetch(path: string, init: RequestInit = {}) {
  return fetch(`${BACKEND}${path}`, { cache: "no-store", ...init });
}
