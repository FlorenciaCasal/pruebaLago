"use client";
export const dynamic = "force-dynamic";
import React from "react";
import Link from "next/link";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        //         <div className="min-h-screen bg-neutral-900 text-neutral-100">
        //             <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        //                 <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        //                 </div>
        //             </header>

        //             <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-12 gap-6">
        //                 <aside className="col-span-12 md:col-span-3">
        //                     <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
        //                         <p className="text-xs uppercase tracking-wide text-neutral-400 mb-3">Secciones</p>
        //                         <ul className="space-y-1">
        //                             <li><Link href="/admin/reservas" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Reservas</Link></li>
        //                             <li><Link href="/admin/eventos" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Agregar evento</Link></li>
        //                             <li><Link href="/admin/calendario" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Calendario</Link></li>
        //                             <li> <Link href="/admin" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Panel de Administración</Link></li>
        //                             <li> <Link href="/admin/usuarios" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Usuarios</Link></li>
        //                         </ul>
        //                     </div>
        //                 </aside>

        //                 <main className="col-span-12 md:col-span-9">
        //                     {children}
        //                 </main>
        //             </div>
        //         </div>

        //     );
        // }
        <div className="min-h-screen w-full overflow-x-hidden bg-neutral-900 text-neutral-100">
            {/* <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between"> */}
            <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
                <div className="mx-auto max-w-screen-2xl px-4 py-4 flex items-center justify-between">
                    {/* ... */}
                </div>
            </header>

            {/* <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-12 gap-6"> */}
            <div className="mx-auto max-w-screen-2xl px-4 py-6 grid grid-cols-12 gap-6">
                {/* <aside className="col-span-12 md:col-span-3 min-w-0"> */}
                <aside className="col-span-12 lg:col-span-3 min-w-0">
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                        <p className="text-xs uppercase tracking-wide text-neutral-400 mb-3">Secciones</p>
                        <ul className="space-y-1">
                            <li><Link href="/admin/reservas" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Reservas</Link></li>
                            <li><Link href="/admin/eventos" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Agregar evento</Link></li>
                            <li><Link href="/admin/calendario" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Calendario</Link></li>
                            <li><Link href="/admin" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Panel de Administración</Link></li>
                            <li><Link href="/admin/usuarios" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Usuarios</Link></li>
                        </ul>
                    </div>
                </aside>

                {/* 👇 ESTE min-w-0 ES LA CLAVE PARA QUE EL CONTENIDO NO “ROMPA” EL GRID */}
                {/* <main className="col-span-12 md:col-span-9 min-w-0"> */}
                <main className="col-span-12 lg:col-span-9 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
