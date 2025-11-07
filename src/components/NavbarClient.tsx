"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import Image from "next/image";

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
        <div className="flex items-center justify-between gap-2 py-2 md:py-3">
          {/* LOGO: más chico en mobile */}
          <div className="shrink-0">
            <Image
              src="/img/logo.png"
              alt="Reserva Natural Lago Escondido"
              width={160}
              height={40}
              priority
              sizes="(max-width: 640px) 120px, 160px"
              className="h-6 w-auto md:h-8" /* h-6 (~24px) en xs, h-8 (~32px) en md+ */
            />
          </div>

          {/* LINKS: texto corto en mobile, padding/gap más compactos */}
          <div className="min-w-0 flex flex-1 justify-end">
            <div className="flex items-center gap-1 md:gap-3 text-sm md:text-base overflow-x-auto no-scrollbar">
              {showHomeLink && (
                <Link
                  href="/"
                  // className="whitespace-nowrap px-2 py-1 rounded hover:bg-neutral-800"
                    className="px-3 py-1.5 text-sm hover:text-[#8e8e8f]"
                >
                  Inicio
                </Link>
              )}

              {isHome && isLogged && isAdmin && (
                <Link
                  href="/admin"
                  className="text-white no-underlinepx-3 py-1.5 text-sm hover:text-[#8e8e8f] whitespace-nowrap"
                >
                  {/* Etiqueta corta en xs, larga en md+ */}
                  <span className="md:hidden">Admin</span>
                  <span className="hidden md:inline">Panel de Administración</span>
                </Link>
              )}

              {!isLogged ? (
                <Link
                  href="/login"
                  className="text-white no-underline px-2 md:px-3 py-1 text-sm hover:text-[#8e8e8f] whitespace-nowrap"
                >
                  Ingresar
                </Link>
              ) : (
                <div className="px-0.5 md:px-0">
                  <LogoutButton />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}