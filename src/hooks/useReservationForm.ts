"use client";
import { useForm } from "react-hook-form";
import type { ReservationFormData } from "@/types/reservation";

export function useReservationForm() {
  const form = useForm<ReservationFormData>({
    defaultValues: {
      nombre: "", apellido: "", dni: "", telefono: "", correo: "",
      adultos14: 1, menores14: 0, movilidadReducida: 0,
      alergias: "no", detalleAlergias: "", comentarios: "",
      origenVisita: "", comoNosConociste: "", aceptaReglas: false,
    },
  });

  const w = form.watch;
  const adultos14 = Math.max(1, w("adultos14") ?? 1);
  const menores14 = Math.max(0, w("menores14") ?? 0);
  const movilidadReducida = Math.max(0, w("movilidadReducida") ?? 0);
  const totalPersonas = adultos14 + menores14;

  const setAdultos = (next: number) => {
    const safe = Math.max(1, next || 1);
    form.setValue("adultos14", safe, { shouldDirty: true });
    const newTotal = safe + menores14;
    if (movilidadReducida > newTotal) form.setValue("movilidadReducida", newTotal, { shouldDirty: true });
  };

  const setMenores = (next: number) => {
    const safe = Math.max(0, next || 0);
    form.setValue("menores14", safe, { shouldDirty: true });
    const newTotal = adultos14 + safe;
    if (movilidadReducida > newTotal) form.setValue("movilidadReducida", newTotal, { shouldDirty: true });
  };

  const setMovilidad = (next: number) => {
    const max = totalPersonas;
    const safe = Math.min(Math.max(0, next || 0), max);
    form.setValue("movilidadReducida", safe, { shouldDirty: true });
  };

  const validateGroup = () => {
    if (adultos14 < 1) return "Debe haber al menos 1 persona de 14 años o más (te incluimos a vos).";
    if (movilidadReducida > totalPersonas) return "La cantidad con movilidad reducida no puede superar el total de personas.";
    return null;
  };

  const validateOrigen = () => ((w("origenVisita") ?? "").trim() ? null : "Por favor, contanos desde dónde nos visitás.");
  const validateConociste = () => (w("comoNosConociste") ? null : "Elegí una opción sobre cómo nos conociste.");

  return {
    ...form,
    adultos14, menores14, movilidadReducida, totalPersonas,
    setAdultos, setMenores, setMovilidad,
    validateGroup, validateOrigen, validateConociste,
  };
}
