"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function NavbarClient({ isLogged, isAdmin, isAdminLimit }: { isLogged: boolean; isAdmin: boolean; isAdminLimit: boolean }) {
  const pathname = usePathname();
  const isHome = pathname == "/";
  const showHomeLink = pathname !== "/";
  // 👇 rutas donde NO queremos mostrar el navbar
  const HIDE_ON: string[] = ["/politicas-de-visita"];

  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // return condicional DESPUÉS de hooks
  if (HIDE_ON.includes(pathname)) return null;


  return (
    //     // <nav className="sticky top-0 z-50 bg-neutral-900 text-white">
    //     <nav className="sticky top-0 z-50 bg-[#E2BC52] text-text">
    //       <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">
    //         <div className="flex items-center justify-between gap-2 py-2 md:py-3">
    //           {/* LOGO: más chico en mobile */}
    //           <div className="shrink-0">
    //             <Link
    //               href="/" >
    //               <Image
    //                 src="/img/logo.png"
    //                 alt="Reserva Natural Lago Escondido"
    //                 width={160}
    //                 height={40}
    //                 priority
    //                 sizes="(max-width: 640px) 120px, 160px"
    //                 className="h-8 w-auto md:h-12" /* h-6 (~24px) en xs, h-8 (~32px) en md+ */
    //               />
    //             </Link>
    //           </div>

    //           {/* LINKS: texto corto en mobile, padding/gap más compactos */}
    //           <div className="min-w-0 flex flex-1 justify-end">
    //             <div className="flex items-center gap-1 md:gap-3 text-sm md:text-base overflow-x-auto no-scrollbar">
    //               {showHomeLink && (
    //                 <Link
    //                   href="/"
    //                   // className="whitespace-nowrap px-2 py-1 rounded hover:bg-neutral-800"
    //                   className="px-3 py-1.5 text-sm hover:text-[#8e8e8f]"
    //                 >
    //                   INICIO
    //                 </Link>
    //               )}

    //               {isHome && isLogged && isAdmin || isAdminLimit && (
    //                 <Link
    //                   href="/admin"
    //                   // className="text-white no-underlinepx-3 py-1.5 text-sm hover:text-[#8e8e8f] whitespace-nowrap"
    //                   className="no-underlinepx-3 py-1.5 text-sm hover:text-[#8e8e8f] whitespace-nowrap"
    //                 >
    //                   {/* Etiqueta corta en xs, larga en md+ */}
    //                   <span className="md:hidden">ADMIN</span>
    //                   <span className="hidden md:inline">PANEL DE ADMINISTRACIÓN</span>
    //                 </Link>
    //               )}

    //               {!isLogged ? (
    //                 <Link
    //                   href="/login"
    //                   // className="text-white no-underline px-2 md:px-3 py-1 text-sm hover:text-[#8e8e8f] whitespace-nowrap"
    //                   className="no-underline px-2 md:px-3 py-1 text-sm hover:text-[#8e8e8f] whitespace-nowrap"
    //                 >
    //                   INGRESAR
    //                 </Link>
    //               ) : (
    //                 <div className="px-0.5 md:px-0">
    //                   <LogoutButton />
    //                 </div>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </nav>
    //   );
    // }
    <nav
      className={`
        w-full sticky top-0 z-50 transition-colors duration-300
        ${scrolled ? "bg-white shadow-md" : "bg-background"}
      `}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-16">
        <div className="flex items-center justify-between gap-4 py-3">

          {/* LOGO */}
          <Link href="/">
            <Image
              src="/img/logo.png"
              alt="Reserva Natural Lago Escondido"
              width={160}
              height={40}
              priority
              className="w-auto h-10 md:h-12 "
            />
          </Link>

          {/* LINKS */}
          <div className="flex items-center justify-end text-text gap-2 sm:gap-6 text-xs font-semibold">

            {showHomeLink && (
              <Link
                href="/"
                className={`transition ${scrolled ? "hover:text-[#8e8e8f]" : "hover:text-[#8e8e8f]"
                  }`}
              >
                INICIO
              </Link>
            )}

            {isHome && (isLogged && isAdmin || isAdminLimit) && (
              <Link
                href="/admin"
                className={`transition ${scrolled ? "hover:text-[#8e8e8f]" : "hover:text-[#8e8e8f]"
                  }`}
              >
                <span className="md:hidden">ADMIN</span>
                <span className="hidden md:inline">PANEL DE ADMINISTRACIÓN</span>
              </Link>
            )}

            {!isLogged ? (
              <Link
                href="/login"
                className={`transition ${scrolled ? "hover:text-[#8e8e8f]" : "hover:text-[#8e8e8f]"
                  }`}
              >
                INGRESAR
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