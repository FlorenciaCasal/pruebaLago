// "use client";
// import React, { useMemo, useState } from "react";
// import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
// import type { ReservationFormData, ComoNosConociste } from "@/types/reservation";
// import { radioCard, radioHidden, radioBadge } from "@/styles/ui";

// type Props = {
//     register: UseFormRegister<ReservationFormData>;
//     watch: UseFormWatch<ReservationFormData>;
//     setValue: UseFormSetValue<ReservationFormData>;
//     totalPersonas: number;
//     uxError?: string | null;
// };

// export default function NeedsStep({ register, watch, setValue, totalPersonas, uxError }: Props) {
//     // ---- MOVILIDAD (misma lógica que "alérgicos")
//     // ⚠️ clave correcta: movilidadReducidaSiNo
//     const movSiNo = (watch("movilidadReducidaSiNo") ?? "no") as "si" | "no";
//     const movCant = Number(watch("movilidadReducida") ?? 0);


//     // ---- ALÉRGICOS
//     const alergias = (watch("alergias") ?? "no") as "si" | "no";
//     const alergicos = Number(watch("alergicos") ?? 0);


//     const movSi = movCant > 0;                 // true si hay movilidad reducida
//     const alergiasSi = alergias === "si";        // true si hay alergias

//     let comentariosPlaceholder = "Escribí cualquier información adicional relevante…";
//     if (alergiasSi && movSi) {
//         comentariosPlaceholder = "Detalles sobre las alergias y las necesidades de movilidad reducida…";
//     } else if (alergiasSi) {
//         comentariosPlaceholder = "Detalles sobre las alergias (tipo, precauciones, etc.)…";
//     } else if (movSi) {
//         comentariosPlaceholder = "Indica requerimientos para personas con movilidad reducida…";
//     }

//     // ---- DESPLEGABLE "¿Cómo te enteraste...?"
//     const [openConociste, setOpenConociste] = useState(false);
//     const conociste = watch("comoNosConociste") as ComoNosConociste | undefined;

//     const opcionesConociste: { v: ComoNosConociste; t: string }[] = [
//         { v: "redes", t: "Redes sociales" },
//         { v: "recomendacion", t: "Recomendación" },
//         { v: "sitio", t: "Sitio web" },
//         { v: "publicidad", t: "Publicidad" },
//         { v: "otro", t: "Otro" },
//     ];

//     const labelConociste = useMemo(() => {
//         const found = opcionesConociste.find(o => o.v === conociste);
//         return found?.t ?? "Elegí una opción";
//     }, [conociste]);

//     const clamp = (n: number) => Math.max(0, Math.min(Number.isFinite(n) ? n : 0, totalPersonas));

//     return (
//         <div className="space-y-6 rounded-xl bg-white/5 border border-white/10 p-4">
//             {/* Errores */}
//             {uxError && (
//                 <div className="rounded-md bg-red-600/20 border border-red-600 px-3 py-2 text-sm text-red-200">
//                     {uxError}
//                 </div>
//             )}

//             {/* ===== Movilidad reducida ===== */}
//             <section className="space-y-2">
//                 <div className="font-medium">¿Personas con movilidad reducida?</div>

//                 <div className="flex flex-wrap items-center gap-4">
//                     {/* Radios */}
//                     <div className="flex items-center gap-6 text-sm">
//                         <label className="inline-flex items-center gap-2 cursor-pointer">
//                             <input
//                                 type="radio"
//                                 className="accent-white"
//                                 checked={movSiNo === "si"}
//                                 onChange={() => {
//                                     setValue("movilidadReducidaSiNo", "si", { shouldDirty: true });
//                                     if (!movCant) setValue("movilidadReducida", 1, { shouldDirty: true });
//                                 }}
//                             />
//                             <span>Sí</span>
//                         </label>
//                         <label className="inline-flex items-center gap-2 cursor-pointer">
//                             <input
//                                 type="radio"
//                                 className="accent-white"
//                                 checked={movSiNo === "no"}
//                                 onChange={() => {
//                                     setValue("movilidadReducidaSiNo", "no", { shouldDirty: true });
//                                     setValue("movilidadReducida", 0, { shouldDirty: true });
//                                 }}
//                             />
//                             <span>No</span>
//                         </label>
//                     </div>

//                     {/* Campo "¿Cuántas?" a la derecha */}
//                     {movSiNo === "si" && (
//                         <div className="flex items-center gap-2 ml-auto">
//                             <label className="text-sm text-white/80">¿Cuántas?</label>
//                             <input
//                                 type="number"
//                                 min={1}
//                                 max={totalPersonas}
//                                 value={movCant || 1}
//                                 onChange={(e) =>
//                                     setValue("movilidadReducida", Math.max(1, clamp(parseInt(e.target.value, 10))), { shouldDirty: true })
//                                 }
//                                 inputMode="numeric"
//                                 className="w-20"
//                             />
//                         </div>
//                     )}
//                 </div>
//             </section>

//             {/* ===== Alérgicos ===== */}
//             <section className="space-y-2">
//                 <div className="font-medium">¿Personas alérgicas?</div>

//                 <div className="flex flex-wrap items-center gap-4">
//                     <div className="flex items-center gap-6 text-sm">
//                         <label className="inline-flex items-center gap-2 cursor-pointer">
//                             <input
//                                 type="radio"
//                                 className="accent-white"
//                                 checked={alergias === "si"}
//                                 onChange={() => {
//                                     setValue("alergias", "si", { shouldDirty: true });
//                                     if (!alergicos) setValue("alergicos", 1, { shouldDirty: true });
//                                 }}
//                             />
//                             <span>Sí</span>
//                         </label>
//                         <label className="inline-flex items-center gap-2 cursor-pointer">
//                             <input
//                                 type="radio"
//                                 className="accent-white"
//                                 checked={alergias === "no"}
//                                 onChange={() => {
//                                     setValue("alergias", "no", { shouldDirty: true });
//                                     setValue("alergicos", 0, { shouldDirty: true });
//                                 }}
//                             />
//                             <span>No</span>
//                         </label>
//                     </div>

//                     {/* Campo "¿Cuántas?" a la derecha */}
//                     {alergias === "si" && (
//                         <div className="flex items-center gap-2 ml-auto">
//                             <label className="text-sm text-white/80">¿Cuántas?</label>
//                             <input
//                                 type="number"
//                                 min={1}
//                                 max={totalPersonas}
//                                 value={alergicos || 1}
//                                 onChange={(e) =>
//                                     setValue("alergicos", Math.max(1, clamp(parseInt(e.target.value, 10))), { shouldDirty: true })
//                                 }
//                                 inputMode="numeric"
//                                 className="w-20"
//                             />
//                         </div>
//                     )}
//                 </div>
//             </section>

//             {/* Comentarios */}
//             <section className="space-y-2">
//                 <label className="font-medium">Comentarios (opcional)</label>
//                 <textarea
//                     {...register("comentarios")}
//                     rows={4}
//                     className="w-full rounded-md border border-white/20 bg-white/5 p-2 text-white"
//                     placeholder={comentariosPlaceholder}
//                 />
//             </section>

//             {/* ===== ¿Cómo te enteraste…? — DESPLEGABLE con tarjetas A–E ===== */}
//             <section className="space-y-2">
//                 <p className="font-medium">¿Cómo te enteraste de nuestra existencia?</p>

//                 <button
//                     type="button"
//                     className="w-full text-left rounded-lg border border-white/20 bg-white/5 px-3 py-2 hover:bg-white/10 transition flex items-center justify-between"
//                     onClick={() => setOpenConociste(o => !o)}
//                 >
//                     <span>{labelConociste}</span>
//                     <span className="ml-3">▾</span>
//                 </button>

//                 {openConociste && (
//                     <div className="mt-3 grid gap-3">
//                         {opcionesConociste.map(({ v, t }, i) => {
//                             const letter = String.fromCharCode(65 + i); // A, B, C...
//                             const checked = v === conociste;
//                             return (
//                                 <label key={v} className={radioCard}>
//                                     <input
//                                         type="radio"
//                                         value={v}
//                                         checked={checked}
//                                         onChange={() => {
//                                             setValue("comoNosConociste", v, { shouldDirty: true });
//                                             setOpenConociste(false);
//                                         }}
//                                         className={radioHidden}
//                                     />
//                                     <span className={radioBadge} aria-hidden="true">{letter}</span>
//                                     <span className="font-medium">{t}</span>
//                                 </label>
//                             );
//                         })}
//                     </div>
//                 )}
//             </section>


//         </div>
//     );
// }

