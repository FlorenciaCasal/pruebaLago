export const dynamic = "force-dynamic";
import React from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100">
            <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Panel de Administración</h1>
                    <nav className="flex gap-4 text-sm">
                        <Link href="/" className="text-neutral-300 hover:text-white">Volver al sitio</Link>
                    </nav>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-12 gap-6">
                <aside className="col-span-12 md:col-span-3">
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                        <p className="text-xs uppercase tracking-wide text-neutral-400 mb-3">Secciones</p>
                        <ul className="space-y-1">
                            <li><Link href="/admin/reservas" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Reservas pendientes</Link></li>
                            <li><Link href="/admin/eventos" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Agregar evento</Link></li>
                            <li><Link href="/admin/calendario" className="block rounded-xl px-3 py-2 hover:bg-neutral-800">Calendario</Link></li>
                        </ul>
                    </div>
                </aside>

                <main className="col-span-12 md:col-span-9">
                    {children}
                </main>
            </div>
        </div>
    );
}