"use client";
import React from "react";
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import type { ReservationFormData } from "@/types/reservation";

type Props = {
  register: UseFormRegister<ReservationFormData>;
  watch: UseFormWatch<ReservationFormData>;
  setValue: UseFormSetValue<ReservationFormData>;
  totalPersonas: number;
  uxError?: string | null;
};

export default function SaludStep({ register, watch, setValue, totalPersonas, uxError }: Props) {
  // MOVILIDAD
  const movSiNo = (watch("movilidadReducidaSiNo") ?? "no") as "si" | "no";
  const movCant = Number(watch("movilidadReducida") ?? 0);
  const movSi = movCant > 0;

  const clamp = (n: number) =>
    Math.max(0, Math.min(Number.isFinite(n) ? n : 0, totalPersonas));

  const comentariosPlaceholder = movSi
    ? "Indicá requerimientos para personas con movilidad reducida…"
    : "Escribí cualquier información adicional relevante…";

  return (
    <div className="space-y-6 rounded-xl bg-white/5 border border-secondary p-4">
      {uxError && (
        <div className="rounded-md bg-red-600/20 border border-red-600 px-3 py-2 text-sm text-red-200">
          {uxError}
        </div>
      )}

      {/* Movilidad reducida */}
      <section className="space-y-2">
        <div className="font-medium">¿Personas con movilidad reducida?</div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                // className="accent-white"
                className="accent-gray-800 w-4 h-4 rounded-full focus-visible:outline-none focus-visible:ring-0"

                checked={movSiNo === "si"}
                onChange={() => {
                  setValue("movilidadReducidaSiNo", "si", { shouldDirty: true });
                  if (!movCant) setValue("movilidadReducida", 1, { shouldDirty: true });
                }}
              />
              <span>Sí</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                // className="accent-white"
                className="accent-gray-800 w-4 h-4 rounded-full focus-visible:outline-none focus-visible:ring-0"

                checked={movSiNo === "no"}
                onChange={() => {
                  setValue("movilidadReducidaSiNo", "no", { shouldDirty: true });
                  setValue("movilidadReducida", 0, { shouldDirty: true });
                }}
              />
              <span>No</span>
            </label>
          </div>

          {movSiNo === "si" && (
            <div className="flex items-center gap-2 md:ml-auto">
              <label className="text-sm text-black">¿Cuántas?</label>
              <input
                type="number"
                min={1}
                max={totalPersonas}
                value={movCant || 1}
                onChange={(e) =>
                  setValue(
                    "movilidadReducida",
                    Math.max(1, clamp(parseInt(e.target.value, 10))),
                    { shouldDirty: true }
                  )
                }
                inputMode="numeric"
                className="w-20"
              />
            </div>
          )}
        </div>
      </section>

      {/* Comentarios */}
      <section className="space-y-2">
        <label className="px-2 font-medium">Comentarios (opcional)</label>
        <textarea
          {...register("comentarios")}
          rows={4}
          className="w-full rounded-md border border-secondary bg-white/5 p-2 text-black"
          placeholder={comentariosPlaceholder}
        />
      </section>
    </div>
  );
}
