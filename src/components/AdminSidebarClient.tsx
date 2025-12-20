"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebarClient({
    isAdmin,
    children,
}: {
    isAdmin: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        setOpen(false);
    }, [pathname]);

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <>
            <div className="min-h-screen w-full overflow-x-hidden bg-gray-800 text-neutral-100">
                {/* Topbar solo mobile: título + hamburguesa */}
                {/* <div className="xl:hidden sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-neutral-800"> */}
                <div className="sm:hidden sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-neutral-800">
                    <div className="mx-auto max-w-screen-2xl px-4 h-12 flex items-center justify-between">
                        {/* Título: lo sobreescribe cada página si quiere (ver ReservasPage) */}
                        <h1 className="text-base font-medium">Secciones</h1>
                        <button
                            aria-label="Abrir menú"
                            onClick={() => setOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-1.5 hover:bg-neutral-800"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                <rect x="3" y="6" width="18" height="2" rx="1" />
                                <rect x="3" y="11" width="18" height="2" rx="1" />
                                <rect x="3" y="16" width="18" height="2" rx="1" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* grid principal */}
                <div className="mx-auto max-w-screen-2xl grid grid-cols-12 gap-6">
                    {/* <div className="hidden xl:flex bg-gray-900 items-center mx-auto px-8 justify-between w-[100vw]"> */}
                    <div className="hidden sm:flex bg-gray-900 items-center mx-auto px-8 justify-between w-[100vw]">
                        <h1 className="text-base font-medium">Secciones</h1>
                        <div className="h-12 flex items-center gap-x-6">

                            <Link href="/admin/reservas"
                                className={`px-3 py-2 rounded-lg text-sm hover:bg-neutral-800 ${pathname === "/admin/reservas" ? "bg-neutral-800 text-white" : "text-neutral-300"}`}>
                                Reservas
                            </Link>

                            <Link href="/admin/calendario"
                                className={`px-3 py-2 rounded-lg text-sm hover:bg-neutral-800 ${pathname === "/admin/calendario" ? "bg-neutral-800 text-white" : "text-neutral-300"}`}>
                                Calendario
                            </Link>
                            {isAdmin && (
                                <Link href="/admin/usuarios"
                                    className={`px-3 py-2 rounded-lg text-sm hover:bg-neutral-800 ${pathname === "/admin/usuarios" ? "bg-neutral-800 text-white" : "text-neutral-300"}`}>
                                    Usuarios
                                </Link>
                            )}

                        </div>
                    </div>
                    {/* <main className="col-span-12 px-4 min-w-0"> */}
                    <main className="col-span-14 px-2 min-w-0">
                        {children}
                    </main>
                </div>


                {/* Drawer mobile (overlay + panel) con animación */}
                {/* Overlay con fade */}
                <div
                    onClick={() => setOpen(false)}
                    className={`fixed inset-0 z-40 bg-black/50 sm:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                />

                {/* Panel lateral con slide-in / slide-out */}
                <div
                    className={`fixed z-50 inset-y-0 left-0 w-72 max-w-[80vw] bg-neutral-950/90 border-r border-neutral-800 p-4 shadow-2xl sm:hidden transform transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs uppercase tracking-wide text-neutral-400">
                            Secciones
                        </p>
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Cerrar"
                            className="rounded-md px-2 py-1 hover:bg-neutral-900 text-neutral-300"
                        >
                            ✕
                        </button>
                    </div>

                    <nav>
                        <ul className="space-y-1 text-neutral-200 text-sm">
                            <li>
                                <Link
                                    href="/admin/reservas"
                                    className={`block rounded-xl px-3 py-2 hover:bg-neutral-800 ${pathname === "/admin/reservas" ? "bg-neutral-900" : ""}`}
                                >
                                    Reservas
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/admin/calendario"
                                    className={`block rounded-xl px-3 py-2 hover:bg-neutral-800 ${pathname === "/admin/calendario" ? "bg-neutral-900" : ""}`}
                                >
                                    Calendario
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/admin"
                                    className={`block rounded-xl px-3 py-2 hover:bg-neutral-800 ${pathname === "/admin" ? "bg-neutral-900" : ""}`}
                                >
                                    Panel de Administración
                                </Link>
                            </li>

                            {isAdmin && (
                                <li>
                                    <Link
                                        href="/admin/usuarios"
                                        className={`block rounded-xl px-3 py-2 hover:bg-neutral-800 ${pathname === "/admin/usuarios" ? "bg-neutral-900" : ""}`}
                                    >
                                        Usuarios
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
