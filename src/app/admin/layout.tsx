// "use client";
// export const dynamic = "force-dynamic";
// import React from "react";
// import Link from "next/link";


// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//     return (
//         <div className="min-h-screen w-full overflow-x-hidden bg-gray-800 text-neutral-100">
//             <div className="mx-auto max-w-screen-2xl px-4 py-6 grid grid-cols-12 gap-6">
//                 {/* <aside className="col-span-12 md:col-span-3 min-w-0"> */}
//                 <aside className="col-span-12 lg:col-span-3 min-w-0">
//                     <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
//                         <p className="text-xs uppercase tracking-wide text-neutral-400 mb-3">Secciones</p>
//                         <ul className="space-y-1">
//                             <li><Link href="/admin/reservas" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Reservas</Link></li>
//                             <li><Link href="/admin/eventos" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Agregar evento</Link></li>
//                             <li><Link href="/admin/calendario" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Calendario</Link></li>
//                             <li><Link href="/admin" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Panel de Administración</Link></li>
//                             <li><Link href="/admin/usuarios" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Usuarios</Link></li>
//                         </ul>
//                     </div>
//                 </aside>

//                 {/* 👇 ESTE min-w-0 ES LA CLAVE PARA QUE EL CONTENIDO NO “ROMPA” EL GRID */}
//                 {/* <main className="col-span-12 md:col-span-9 min-w-0"> */}
//                 <main className="col-span-12 lg:col-span-9 min-w-0">
//                     {children}
//                 </main>
//             </div>
//         </div>
//     );
// }
"use client";
export const dynamic = "force-dynamic";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  React.useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-800 text-neutral-100">
      {/* ⬇️ este grid tiene py-6 (3rem totales) */}
      <div className="mx-auto max-w-screen-2xl px-4 py-6 grid grid-cols-12 gap-6">

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3 min-w-0 lg:sticky lg:top-0">
          {/* ⬇️ Alto exacto: viewport - 3rem (padding vertical del grid) */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 lg:h-full lg:overflow-auto">
            {/* Header del panel (opcional sticky interno) */}
            <div className="flex items-center justify-between px-4 py-3 lg:py-4
                            lg:sticky lg:top-0 lg:bg-neutral-950 lg:z-10 lg:border-b lg:border-neutral-900/60">
              <p className="text-xs uppercase tracking-wide text-neutral-400">Secciones</p>
              <button
                className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-1.5 hover:bg-neutral-900"
                aria-expanded={open}
                aria-controls="admin-sections"
                onClick={() => setOpen(o => !o)}
              >
                <span aria-hidden className="inline-block w-4">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <rect x="3" y="6" width="18" height="2" rx="1" />
                    <rect x="3" y="11" width="18" height="2" rx="1" />
                    <rect x="3" y="16" width="18" height="2" rx="1" />
                  </svg>
                </span>
              </button>
            </div>

            <div id="admin-sections" className={"px-4 pb-4 " + (open ? "block" : "hidden lg:block")}>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin/reservas"
                        className={`block rounded-xl px-3 py-2 hover:bg-neutral-800 ${pathname === "/admin/reservas" ? "bg-neutral-900" : ""}`}>
                    Reservas
                  </Link>
                </li>
                <li>
                  <Link href="/admin/eventos"
                        className={`block rounded-xl px-3 py-2 hover:bg-neutral-800 ${pathname === "/admin/eventos" ? "bg-neutral-900" : ""}`}>
                    Agregar evento
                  </Link>
                </li>
                <li>
                  <Link href="/admin/calendario"
                        className={`block rounded-xl px-3 py-2 hover:bg-neutral-800 ${pathname === "/admin/calendario" ? "bg-neutral-900" : ""}`}>
                    Calendario
                  </Link>
                </li>
                <li>
                  <Link href="/admin"
                        className={`block rounded-xl px-3 py-2 hover:bg-neutral-800 ${pathname === "/admin" ? "bg-neutral-900" : ""}`}>
                    Panel de Administración
                  </Link>
                </li>
                <li>
                  <Link href="/admin/usuarios"
                        className={`block rounded-xl px-3 py-2 hover:bg-neutral-800 ${pathname === "/admin/usuarios" ? "bg-neutral-900" : ""}`}>
                    Usuarios
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Contenido */}
        <main className="col-span-12 lg:col-span-9 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
