// "use client";

// import React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export const dynamic = "force-dynamic";

// const NAV = [
//   { href: "/admin/reservas", label: "Reservas pendientes" },
//   { href: "/admin/eventos", label: "Agregar evento" },
//   { href: "/admin/calendario", label: "Calendario" },
// ];

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();

//   return (
//     <div className="min-h-screen bg-neutral-900 text-neutral-100">
//       <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
//         {/* <div className="w-full px-3 sm:px-4 lg:px-8 py-4 flex items-center justify-between">
//           <h1 className="text-lg font-semibold">Panel de Administración</h1>
//           <nav className="flex gap-4 text-sm">
//             <Link href="/" className="text-neutral-300 hover:text-white">Volver al sitio</Link>
//           </nav>
//         </div> */}
//       </header>

//       {/* Full width, sin centrar, con sidebar fijo en desktop */}
//       <div className="w-full px-2 sm:px-4 lg:px-8 py-6 grid md:grid-cols-[260px_1fr] gap-6">
//         <aside className="md:sticky md:top-20 md:self-start">
//           <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
//             <p className="text-xs uppercase tracking-wide text-neutral-400 mb-3">Secciones</p>
//             <ul className="space-y-1">
//               {NAV.map(i => (
//                 <li key={i.href}>
//                   <Link
//                     href={i.href}
//                     className={`block rounded-xl px-3 py-2 hover:bg-neutral-800 ${
//                       pathname?.startsWith(i.href) ? "bg-neutral-800 text-white" : "text-neutral-200"
//                     }`}
//                   >
//                     {i.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </aside>

//         {/* min-w-0 evita overflow por contenidos anchos */}
//         <main className="min-w-0">{children}</main>
//       </div>
//     </div>
//   );
// }
// app/admin/layout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin/reservas", label: "Reservas pendientes" },
  { href: "/admin/eventos", label: "Agregar evento" },
  { href: "/admin/calendario", label: "Calendario" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const NavList = (
    <ul className="space-y-1">
      {NAV.map(i => (
        <li key={i.href}>
          <Link
            href={i.href}
            onClick={() => setOpen(false)}
            className={`block rounded-xl px-3 py-2 hover:bg-neutral-800 ${
              pathname?.startsWith(i.href) ? "bg-neutral-800 text-white" : "text-neutral-200"
            }`}
          >
            {i.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        <div className="w-full px-3 sm:px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger (solo mobile) */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-neutral-700 px-3 py-2"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <h1 className="text-lg font-semibold">Panel de Administración</h1>
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="text-neutral-300 hover:text-white">Volver al sitio</Link>
          </nav>
        </div>
      </header>

      {/* Layout de contenido */}
      <div className="w-full px-2 sm:px-4 lg:px-8 py-6 grid md:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar desktop */}
        <aside className="hidden md:block md:sticky md:top-20 md:self-start">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
            <p className="text-xs uppercase tracking-wide text-neutral-400 mb-3">Secciones</p>
            {NavList}
          </div>
        </aside>

        {/* Drawer mobile */}
        {open && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
            <aside className="fixed left-0 top-0 bottom-0 w-72 z-50 md:hidden bg-neutral-950 border-r border-neutral-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wide text-neutral-400">Secciones</p>
                <button
                  className="rounded-lg border border-neutral-700 px-2 py-1"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                >
                  ✕
                </button>
              </div>
              {NavList}
            </aside>
          </>
        )}

        {/* Contenido */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

