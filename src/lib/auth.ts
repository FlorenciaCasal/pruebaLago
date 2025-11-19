// src/lib/auth.ts
import { cookies } from "next/headers";

type Role = "ROLE_ADMIN" | "ROLE_MANAGER" | null;

export async function getAuthInfo(): Promise<{
    isLogged: boolean;
    role: Role;
    isAdmin: boolean;
}> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    let role: Role = null;

    if (token) {
        try {
            const [, payload] = token.split(".");
            const json = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
            // Ajustá esto según cómo venga el claim en tu JWT
            // si es "ADMIN"/"MANAGER", va perfecto así:
            role = json.role ?? null;
        } catch {
            role = null;
        }
    }

    const isLogged = !!token;
    const isAdmin = role === "ROLE_ADMIN";

    return { isLogged, role, isAdmin };
}
