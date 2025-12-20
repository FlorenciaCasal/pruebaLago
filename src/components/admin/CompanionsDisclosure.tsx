"use client";
import React from "react";
import type { Companion } from "@/types/admin";
import formatName from "@/utils/formatName";

type Props = {
    companions?: Companion[];
    buttonClassName?: string;
    dense?: boolean; // para usar en cards móviles si querés más compacto
};

export default function CompanionsDisclosure({
    companions = [],
    buttonClassName = "",
    dense = false,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const count = companions.length;

    if (count === 0) {
        return (
            <span className="inline-flex items-center text-xs text-neutral-400">
                Sin visitantes
            </span>
        );
    }

    return (
        // <div className="flex w-full items-start">
        <div className="flex w-full flex-col items-start ">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className={
                    "inline-flex items-center gap-2 py-1.5 text-sm hover:text-neutral-400 " +
                    buttonClassName
                }
                aria-expanded={open}
                aria-controls="companions-panel"
            >
                <span>Visitantes</span>
                <span className="inline-grid place-items-center rounded-md px-2 text-xs bg-neutral-800 text-neutral-200">
                    {count}
                </span>
                <svg
                    className={"w-4 h-4 transition-transform " + (open ? "rotate-180" : "")}
                    viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                >
                    <path d="M7 10l5 5 5-5H7z" />
                </svg>
            </button>

            {open && (
                <div
                    id="companions-panel"
                    className="mt-2 rounded-xl border border-neutral-800 bg-neutral-950"
                >
                    {dense ? (
                        <ul className="p-2 text-sm space-y-1">
                            {companions.map((c, i) => {
                                console.log("companion raw:", c);
                                const fullName = [c.nombre, c.apellido].filter(Boolean).join(" ");
                                return (
                                    // <li key={i} className="flex justify-between gap-2">
                                    //     <span className="break-words">{formatName(fullName)}</span>
                                    //     <span className="font-mono text-neutral-300">{c.dni || "-"}</span>
                                    //     {c.telefono && <span> {c.telefono}</span>}
                                    // </li>
                                    <li key={i} className="flex items-start justify-between gap-3">
                                        {/* izquierda */}
                                        <div className="min-w-0">
                                            <div className="break-words">
                                                {formatName(fullName)}
                                            </div>

                                            {c.telefono && (
                                                <div className="mt-0.5 text-xs text-neutral-400">
                                                    Tel: <span className="font-mono text-neutral-300">{c.telefono}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* derecha */}
                                        <span className="shrink-0 font-mono text-neutral-300">
                                            {c.dni || "-"}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="text-neutral-400">
                                <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
                                    <th className="w-1/2">Nombre y apellido</th>
                                    <th className="w-1/2">DNI</th>
                                    <th className="w-1/4">Teléfono</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {companions.map((c, i) => {
                                    console.log("companion raw:", c);
                                    const fullName = [c.nombre, c.apellido].filter(Boolean).join(" ");
                                    return (
                                        <tr key={i} className="[&>td]:px-3 [&>td]:py-2">
                                            <td className="truncate">{formatName(fullName)}</td>
                                            <td className="font-mono">{c.dni || "-"}</td>
                                            <td className="font-mono text-neutral-300">{c.telefono || "-"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
