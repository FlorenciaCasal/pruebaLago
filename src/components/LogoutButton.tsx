"use client";
import { doLogout } from "@/services/session";

export default function LogoutButton({ isMobile = false }: { isMobile?: boolean }) {
    return (
        <button
            onClick={doLogout}
            // className="text-xs font-semibold hover:text-[#8e8e8f]"
            className={`
                 text-sm transition
                ${isMobile
                    ? "w-full text-left text-neutral-200 block rounded-xl px-3 py-2 hover:bg-neutral-800"   // mobile: 14px + color claro
                    : "font-semibold hover:text-secondary-dark"             // desktop: 12px + tu color actual
                }
            `}
            aria-label="Cerrar sesión"
        // title="Cerrar sesión"
        >
            {isMobile ? "Cerrar sesión" : "CERRAR SESIÓN"}
        </button>
    );
}
