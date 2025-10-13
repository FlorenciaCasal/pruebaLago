"use client";
import { doLogout } from "@/services/session";

export default function LogoutButton() {
    return (
        <button
            onClick={doLogout}
            className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
        >
            Cerrar sesión
        </button>
    );
}
