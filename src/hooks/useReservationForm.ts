"use client";
import { useForm, type UseFormProps } from "react-hook-form";
import type { ReservationFormData } from "@/types/reservation";
import { useEffect } from "react";


export function useReservationForm(options?: UseFormProps<ReservationFormData>) {
  const form = useForm<ReservationFormData>({
    mode: "onChange",
    // ...options,
    defaultValues: {
      // datos de contacto (si los seguís usando)
      nombre: "", apellido: "", dni: "", telefono: "", correo: "", origenVisita: "",

      // NUEVO modelo de grupo
      adultos: 1,        // 18 años o más (incluye a quien reserva)
      ninos: 0,          // 2 a 17 años
      bebes: 0,          // < 2 años
      movilidadReducida: 0,
      movilidadReducidaSiNo: "no",

      // otros
      alergicos: 0,
      alergias: "no",
      detalleAlergias: "",
      comentarios: "",
      comoNosConociste: undefined,
      aceptaReglas: false,

      // campos de flujo
      tipoVisitante: undefined,
      // circuito: undefined,
      fechaISO: undefined,

      // acompañantes / institución
      personas: [],
      institucion: "", institucionLocalidad: "", institucionEmail: "", institucionTelefono: "",
      responsableNombre: "", responsableApellido: "", responsableDni: "",

      // inputs auxiliares de UI
      tmpNombreApe: "", tmpDni: "",

      // 👇 permite sobrescribir desde afuera
      ...(options?.defaultValues ?? {}),
    },
    ...options,
  });

  const w = form.watch;
  // Derivados y clamps
  const adultos = Math.max(1, w("adultos") ?? 1);
  const ninos = Math.max(0, w("ninos") ?? 0);
  const bebes = Math.max(0, w("bebes") ?? 0);
  const movilidadReducida = Math.max(0, w("movilidadReducida") ?? 0);
  const totalPersonas = adultos + ninos + bebes;

  // 🔄 Si cambia el sí/no, ajustamos la cantidad:
  useEffect(() => {
    const flag = w("movilidadReducidaSiNo");
    if (flag === "no" && movilidadReducida !== 0) {
      form.setValue("movilidadReducida", 0, { shouldDirty: true });
    }
    if (flag === "si" && movilidadReducida === 0) {
      form.setValue("movilidadReducida", 1, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w("movilidadReducidaSiNo")]);

  // Setters seguros
  const setAdultos = (next: number) => {
    const safe = Math.max(1, next || 1);
    form.setValue("adultos", safe, { shouldDirty: true });
    const newTotal = safe + ninos + bebes;
    if (movilidadReducida > newTotal) {
      form.setValue("movilidadReducida", newTotal, { shouldDirty: true });
    }
  };

  const setNinos = (next: number) => {
    const safe = Math.max(0, next || 0);
    form.setValue("ninos", safe, { shouldDirty: true });
    const newTotal = adultos + safe + bebes;
    if (movilidadReducida > newTotal) {
      form.setValue("movilidadReducida", newTotal, { shouldDirty: true });
    }
  };

  const setBebes = (next: number) => {
    const safe = Math.max(0, next || 0);
    form.setValue("bebes", safe, { shouldDirty: true });
    const newTotal = adultos + ninos + safe;
    if (movilidadReducida > newTotal) {
      form.setValue("movilidadReducida", newTotal, { shouldDirty: true });
    }
  };

  const setMovilidad = (next: number) => {
    const max = totalPersonas;
    const safe = Math.min(Math.max(0, next || 0), max);
    form.setValue("movilidadReducida", safe, { shouldDirty: true });
  };

  // Validaciones
  const validateGroup = () => {
    if (adultos < 1) return "Debe haber al menos 1 adulto (18 años o más).";
    if (movilidadReducida > totalPersonas) return "La cantidad con movilidad reducida no puede superar el total de personas.";
    return null;
  };

  // const validateOrigen = () =>
  //   ((w("origenVisita") ?? "").trim() ? null : "Por favor, contanos desde dónde nos visitás.");

  const validateConociste = () =>
    (w("comoNosConociste") ? null : "Elegí una opción sobre cómo nos conociste.");

  return {
    ...form,
    trigger: form.trigger,
    errors: form.formState.errors,
    adultos, ninos, bebes, movilidadReducida, totalPersonas,
    setAdultos, setNinos, setBebes, setMovilidad,
    // validateGroup, validateOrigen, validateConociste,
    validateGroup, validateConociste,
  };
}
