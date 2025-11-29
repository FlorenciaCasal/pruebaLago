"use client";
import { doLogout } from "@/services/session";

export default function LogoutButton() {
    return (
        <button
            onClick={doLogout}
            className="text-xs font-semibold hover:text-[#8e8e8f]"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
        >
            CERRAR SESIÓN
        </button>
    );
}
