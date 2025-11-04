"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function NavbarClient({ isLogged, isAdmin }: { isLogged: boolean; isAdmin: boolean }) {
  const pathname = usePathname();
  const isHome = pathname == "/";
  const showHomeLink = pathname !== "/";
  // 👇 rutas donde NO queremos mostrar el navbar
  const HIDE_ON: string[] = ["/politicas-de-visita"];
  const hide = HIDE_ON.includes(pathname);

  if (hide) return null; // ⟵ no se renderiza nada
  return (
    <nav className="sticky top-0 z-50 bg-neutral-900 text-white">
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
        {/* fila principal */}
        <div className="flex items-center justify-between gap-2 py-2 md:py-3">
          {/* Marca: corta en mobile, completa en md+ */}
          <div className="font-bold leading-tight">
            <span className="md:hidden text-base">Lago Escondido</span>
            <span className="hidden md:inline text-lg">
              Reserva Natural Lago Escondido
            </span>
          </div>

          {/* Links: tamaño chico en mobile, evita wrap y permite scroll horizontal si no entra */}
          <div className="flex items-center gap-1 md:gap-3 text-sm md:text-base overflow-x-auto no-scrollbar">
            {showHomeLink && (
              <Link
                href="/"
                className="whitespace-nowrap px-2 py-1 rounded hover:bg-neutral-800"
              >
                Home
              </Link>
            )}


            {isHome && isLogged && isAdmin && (
              <Link href="/admin" className="text-white no-underline px-3 py-1 rounded hover:bg-neutral-800">
                Panel de Administración
              </Link>
            )}

            {!isLogged ? (
              <Link href="/login" className="text-white no-underline px-3 py-1 rounded hover:bg-neutral-800">
                Ingresar
              </Link>
            ) : (
              <LogoutButton />
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
