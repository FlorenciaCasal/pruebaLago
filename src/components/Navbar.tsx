// src/components/Navbar.tsx
import NavbarClient from "./NavbarClient";
import { getAuthInfo } from "@/lib/auth";

export default async function Navbar() {
    const { isLogged, isAdmin, role } = await getAuthInfo();

    console.log("[Navbar]", { isLogged, role });

    return <NavbarClient isLogged={isLogged} isAdmin={isAdmin} />;
}



