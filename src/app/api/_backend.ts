

//  Usamos BEARER. Cambiá a "basic" si tu back aceptara Basic Auth
// const ADMIN_AUTH = (process.env.ADMIN_AUTH || "bearer").toLowerCase() as "bearer" | "basic";

// const ADMIN_USER = process.env.ADMIN_USER || "admin";
// const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

// ─── Basic ───────────────────────────────────────────────────────────────────
// function adminBasicHeader() {
//   // Node runtime -> Buffer OK (App Router en Node)
//   return "Basic " + Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString("base64");
// }

// // ─── Bearer (login + cache en memoria) ───────────────────────────────────────
// type LoginResponse = { token: string; type?: string };

// let cachedToken: string | null = null;
// let tokenExpEpoch: number | null = null; // opcional: si querés parsear exp del JWT

// async function fetchAdminToken(): Promise<string> {
//   // Si quisieras usar expiración del JWT:
//   if (cachedToken && tokenExpEpoch && Date.now() < tokenExpEpoch - 60_000) {
//     return cachedToken;
//   }
//   const resp = await fetch(`${BACKEND}/api/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     // El back espera email/ password (por lo que mostraste en services/auth.ts)
//     body: JSON.stringify({ email: ADMIN_USER, password: ADMIN_PASS }),
//     cache: "no-store",
//   });
//   if (!resp.ok) {
//     const txt = await resp.text().catch(() => "");
//     throw new Error(`Login admin falló (${resp.status}) ${txt}`);
//   }
//   const data = (await resp.json()) as LoginResponse;
//   cachedToken = data.token;

//   // (Opcional) parsear exp si el token es JWT:
//   // try {
//   //   const [, payload] = data.token.split(".");
//   //   const json = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
//   //   if (json?.exp) tokenExpEpoch = json.exp * 1000;
//   // } catch {}

//   return cachedToken!;
// }

// ─── Proxy adminFetch ────────────────────────────────────────────────────────
// export async function adminFetch(path: string, init: RequestInit = {}) {
//   const url = `${BACKEND}${path}`;
//   const baseHeaders: Record<string, string> = {
//     "Content-Type": "application/json",
//     ...(init.headers as Record<string, string> | undefined),
//   };

//   // setear Authorization
//   if (ADMIN_AUTH === "basic") {
//     baseHeaders["Authorization"] = adminBasicHeader();
//   } else {
//     const token = await fetchAdminToken();
//     baseHeaders["Authorization"] = `Bearer ${token}`;
//   }

//   // primer intento
//   let resp = await fetch(url, { ...init, headers: baseHeaders, cache: "no-store" });

//   // Si falla por auth y estamos en modo BEARER, refrescamos token y reintentamos una vez
//   if ((resp.status === 401 || resp.status === 403) && ADMIN_AUTH === "bearer") {
//     try {
//       cachedToken = null;
//       tokenExpEpoch = null;
//       const token = await fetchAdminToken();
//       const retryHeaders = { ...baseHeaders, Authorization: `Bearer ${token}` };
//       resp = await fetch(url, { ...init, headers: retryHeaders, cache: "no-store" });
//     } catch {
//       // dejamos que siga con el 401/403 original
//     }
//   }

//   return resp;
// }

// Público sin auth
// export async function publicFetch(path: string, init: RequestInit = {}) {
//   return fetch(`${BACKEND}${path}`, { cache: "no-store", ...init });
// }

// Usa SIEMPRE el token del usuario logueado (cookie auth_token)



import { cookies } from "next/headers";
const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function getUserAuthHeaders(extra: HeadersInit = {}): Promise<HeadersInit> {
  const cookieStore = await cookies();   // ⬅ acá está la magia
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    throw new Error("No hay token del usuario logueado (auth_token)");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

// Fetch autenticado hacia el backend usando el token real del usuario
export async function backendFetch(path: string, init: RequestInit = {}) {
  const headers = await getUserAuthHeaders(init.headers ?? {}); // await acá
  const url = `${BACKEND}${path}`;

  return fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });
}

// Público sin auth, por si lo necesitás
export async function publicFetch(path: string, init: RequestInit = {}) {
  const url = `${BACKEND}${path}`;
  return fetch(url, { cache: "no-store", ...init });
}

const ADMIN_USER = process.env.ADMIN_USER || "admin@lago-escondido.com";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

let serviceToken: string | null = null;

async function getServiceToken() {
  if (serviceToken) return serviceToken;

  const resp = await fetch(`${BACKEND}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_USER, password: ADMIN_PASS }),
  });

  if (!resp.ok) throw new Error("Login service failed");

  const json = await resp.json();
  serviceToken = json.token;
  return serviceToken;
}

export async function serviceFetch(path: string, init: RequestInit = {}) {
  const token = await getServiceToken();

  const headers = {
    ...(init.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return fetch(`${BACKEND}${path}`, { ...init, headers, cache: "no-store" });
}
