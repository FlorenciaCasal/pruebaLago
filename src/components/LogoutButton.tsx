"use client";
import { doLogout } from "@/services/session";

export default function LogoutButton() {
    return (
        <button
            onClick={doLogout}
            className="px-3 py-1.5 text-sm hover:text-[#8e8e8f]"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
        >
            Cerrar sesión
        </button>
    );
}
