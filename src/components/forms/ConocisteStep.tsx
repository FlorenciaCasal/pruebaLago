"use client";
import React, { useMemo, useState } from "react";
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import type { ReservationFormData, ComoNosConociste } from "@/types/reservation";
import { radioCard, radioHidden, radioBadge } from "@/styles/ui";

type Props = {
  register: UseFormRegister<ReservationFormData>;
  watch: UseFormWatch<ReservationFormData>;
  setValue: UseFormSetValue<ReservationFormData>;
  uxError?: string | null;
};

export default function ConocisteStep({ register, watch, setValue, uxError }: Props) {
  const [open, setOpen] = useState(false);
  const value = watch("comoNosConociste") as ComoNosConociste | undefined;

  const opciones = useMemo(() => [
    { v: "redes" as ComoNosConociste, t: "Redes sociales" },
    { v: "recomendacion" as ComoNosConociste, t: "Recomendación" },
    { v: "sitio" as ComoNosConociste, t: "Sitio web" },
    { v: "publicidad" as ComoNosConociste, t: "Publicidad" },
    { v: "otro" as ComoNosConociste, t: "Otro" },
  ], []);

  const label = useMemo(
    () => opciones.find(o => o.v === value)?.t ?? "Elegí una opción",
    [value, opciones]
  );

  return (
    <div className="space-y-4 rounded-xl bg-white/5 border border-white/10 p-4">
      {uxError && (
        <div className="rounded-md bg-red-600/20 border border-red-600 px-3 py-2 text-sm text-red-200">
          {uxError}
        </div>
      )}

      <div className="font-medium ">¿Cómo te enteraste de nuestra existencia?</div>

      <button
        type="button"
        className="w-full text-left rounded-lg border border-white/20 bg-white/5 px-3 py-2 hover:bg-white/10 transition flex items-center justify-between"
        onClick={() => setOpen(o => !o)}
      >
        <span>{label}</span>
        <span className="ml-3">▾</span>
      </button>

      {open && (
        <div className="mt-3 grid gap-3">
          {opciones.map(({ v, t }, i) => {
            const letter = String.fromCharCode(65 + i);
            return (
              <label key={v} className={radioCard}>
                <input
                  type="radio"
                  value={v}
                  {...register("comoNosConociste")}
                  onChange={() => {
                    setValue("comoNosConociste", v, { shouldDirty: true });
                    setOpen(false);
                  }}
                  className={radioHidden}
                />
                <span className={radioBadge} aria-hidden="true">{letter}</span>
                <span className="font-medium">{t}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
