// src/components/Navbar.tsx
import NavbarClient from "./NavbarClient";
import { cookies } from "next/headers";

export default async function Navbar() {
    const cookieStore = await cookies();           // 👈 await
    const isLogged = !!cookieStore.get("auth_token");
    // const isAdmin = cookieStore.get("admin_perm")?.value === "1"; // ← cookie que setea el login
    const adminCookie = cookieStore.get("admin_perm")?.value;
    const isAdmin = adminCookie === "1";

    // (Opcional para depurar)
    console.log("[Navbar]", { isLogged, adminCookie, all: cookieStore.getAll().map(c => c.name) });

    return <NavbarClient isLogged={isLogged} isAdmin={isAdmin} />;
}

