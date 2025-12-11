"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import StepHeader from "@/components/forms/StepHeader";
import { useReservationForm } from "@/hooks/useReservationForm";
import { submitReservation } from "@/services/reservations";
import type { ReservationFormData } from "@/types/reservation";
import { useFieldArray } from "react-hook-form";
import SaludStep from "../forms/SaludStep";
// import ConocisteStep from "../forms/ConocisteStep";
import SuccessModal from "@/components/SuccessModal";
import { POLICIES_URL } from "./constants";
import { useRegisterPrefillFromQS } from "./hooks/useRegisterPrefillFromQS";
// import { useRegisterUrlSync } from "./hooks/useRegisterUrlSync";
import ContactoStep from "./steps/ContactoStep";
import ListadoStep from "./steps/ListadoStep";
import InstitucionStep from "./steps/InstitucionStep";
import SubmitStep from "./steps/SubmitStep";
import { isVisitante, type Visitante } from "@/utils/visitante";
import { formSchema } from "@/schemas/formSchema";
import * as Yup from "yup";
import { institucionSchema } from "@/schemas/institucionSchemas";
import { listadoSchemaExact } from "@/schemas/listadoSchema";


const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ ''-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
const DNI_RE = /^\d{8}$/;
const PHONE_RE = /^\d{10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LETTERS_LEN = (s: string) => s.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "").length;
const clean = (v: unknown) => String(v ?? "").trim();

export default function RegisterForm({
  initialTipo,
  onCancel,
}: {
  initialTipo?: Visitante | null;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [uxError, setUxError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ----- QS helpers (adultos/niños/bebés) -----
  const toNum = (v: string | null, min = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(min, n) : undefined;
  };
  const qsAdults = toNum(searchParams.get("adults"), 1);
  const qsKids = toNum(searchParams.get("kids"), 0);
  const qsBabies = toNum(searchParams.get("babies"), 0);

  // ----- Form base -----
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    adultos,
    ninos,
    bebes,
    totalPersonas,
    control,
    validateConociste,
    reset,
  } = useReservationForm({
    defaultValues: {
      adultos: qsAdults ?? 1,
      ninos: qsKids ?? 0,
      bebes: qsBabies ?? 0,
      reservaAsiste: true, // NUEVO
    },
  });

  const { fields, append, remove } = useFieldArray({ name: "personas", control });
  const aceptaReglas = watch("aceptaReglas") ?? false;

  // ----- Tipo visitante (form + QS) -----
  const tipoForm = watch("tipoVisitante");
  const { tipoFromQS } = useRegisterPrefillFromQS(searchParams, setValue, watch);

  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (seeded) return;
    if (!isVisitante(tipoForm)) {
      const seed =
        (initialTipo && isVisitante(initialTipo) ? initialTipo : null) ??
        (tipoFromQS ?? null);
      if (seed) {
        setValue("tipoVisitante", seed as Visitante, {
          shouldDirty: true,
          shouldValidate: false,
        });
        setSeeded(true);
      }
    } else {
      setSeeded(true);
    }
  }, [seeded, initialTipo, tipoFromQS, tipoForm, setValue]);

  const tipo: Visitante | null = useMemo(() => {
    return isVisitante(tipoForm)
      ? (tipoForm as Visitante)
      : (initialTipo ?? tipoFromQS ?? null);
  }, [tipoForm, initialTipo, tipoFromQS]);

  const tp = Number(totalPersonas ?? 0);
  // ANTES:
  // const totalEsperado = tipo === "INSTITUCION_EDUCATIVA" ? tp : Math.max(0, tp - 1);  
  // AHORA: SIEMPRE igual al total (porque los visitantes son todos los que van físicamente)
  // const totalEsperado = tp;
  // console.log("totalEsperado", totalEsperado)

  const reservaAsiste = watch("reservaAsiste") ?? true;
  // 👇 cantidad de filas que hay que cargar en el listado (solo acompañantes)
  const extraListado = Math.max(tp - (reservaAsiste ? 1 : 0), 0);

  type StepType = "contacto" | "institucion" | "listado" | "salud" | "conociste" | "submit";

  // ----- Steps (DEBE declararse ANTES de leer safeIndex) -----
  const steps = useMemo(() => {
    if (tipo === "INSTITUCION_EDUCATIVA") {
      return [
        { label: "Datos de la institución y responsable", type: "institucion" as const },
        // { label: "Listado de visitantes", type: "listado" as const },
        ...(extraListado === 0 ? [] : [{ label: "Listado de visitantes", type: "listado" as const }]),
        { label: "Datos de salud o movilidad", type: "salud" as const },
        // { label: "Encuesta rápida", type: "conociste" as const },
        { label: "Revisión y envío", type: "submit" as const },
      ] as const;
    }
    // PARTICULAR
    return [
      { label: "Datos de la persona que hace la reserva", type: "contacto" as const },
      // { label: "Listado de visitantes", type: "listado" as const },
      ...(extraListado === 0 ? [] : [{ label: "Listado de visitantes", type: "listado" as const }]),
      { label: "Datos de salud o movilidad", type: "salud" as const },
      // { label: "Encuesta rápida", type: "conociste" as const },
      { label: "Revisión y envío", type: "submit" as const },
    ] as const;
  }, [tipo, extraListado]);

  // ----- STEP: la fuente de verdad es la URL -----
  const rawStep = Number(searchParams.get("step"));
  const safeIndex = Number.isFinite(rawStep)
    ? Math.max(0, Math.min(rawStep, Math.max(steps.length - 1, 0)))
    : 0;

  const setStep = (n: number) => {
    const clamped = Math.max(0, Math.min(n, Math.max(steps.length - 1, 0)));
    const qs = new URLSearchParams(searchParams);
    qs.set("step", String(clamped));
    router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
  };

  const nextStep = () => setStep(safeIndex + 1);
  const prevStep = () => {
    if (safeIndex === 0) {
      onCancel?.();
      router.replace(pathname, { scroll: false });
    } else {
      setStep(safeIndex - 1);
    }
  };

  const validateListadoWithYup = async (expected: number): Promise<string | null> => {
    try {
      // Validamos SOLO lo que el usuario cargó en el listado (acompañantes)
      const rows = getListadoValues();
      await listadoSchemaExact(expected).validate(rows, { abortEarly: true });
      return null;
    } catch (e) {
      return e instanceof Yup.ValidationError ? prettyArrayError(e) : "Revisá el listado.";
    }
  };


  const onListadoMaybeFixed = async () => {
    // solo si estamos en el paso listado
    if (steps[safeIndex]?.type !== "listado") return;
    const msg = await validateListadoWithYup(extraListado);
    if (!msg && uxError) setUxError(null);
  };

  // --- Validaciones ---
  const validateContacto = () => {
    const nombre = clean(watch("nombre"));
    const apellido = clean(watch("apellido"));
    const dni = clean(watch("dni"));
    const correo = clean(watch("correo"));
    const telefono = clean(watch("telefono"));
    const origenVisita = clean(watch("origenVisita"));

    if (!nombre) return "Completá tu nombre.";
    if (!NAME_RE.test(nombre)) return "Nombre inválido: sólo letras y espacios.";
    if (LETTERS_LEN(nombre) < 3) return "Nombre inválido: mínimo 3 letras.";

    if (!apellido) return "Completá tu apellido.";
    if (!NAME_RE.test(apellido)) return "Apellido inválido: sólo letras y espacios.";
    if (LETTERS_LEN(apellido) < 3) return "Apellido inválido: mínimo 3 letras.";

    if (!dni) return "Completá tu DNI.";
    if (!DNI_RE.test(dni)) return "DNI inválido: deben ser exactamente 8 dígitos.";

    if (!correo) return "Completá tu email.";
    if (!EMAIL_RE.test(correo)) return "Email inválido.";

    if (!telefono) return "Completá tu teléfono.";
    if (!PHONE_RE.test(telefono)) return "Teléfono inválido: deben ser exactamente 10 dígitos.";

    if (!origenVisita) return "Completá tu ciudad de origen.";
    if (LETTERS_LEN(origenVisita) < 3) return "Ciudad de origen inválida: mínimo 3 letras.";
    return null;
  };

  const validateNecesidades = () => {
    const total = (adultos ?? 0) + (ninos ?? 0) + (bebes ?? 0);
    const mov = Number(watch("movilidadReducida") ?? 0);
    if (mov < 0 || mov > total) return "Cantidad con movilidad reducida inválida.";
    return null;
  };

  const validators: Omit<Record<StepType, () => string | null>, "listado"> = {
    contacto: validateContacto,
    institucion: () => null,
    salud: validateNecesidades,
    conociste: validateConociste,
    submit: () => null,
  };

  const getContactoValues = () => ({
    nombre: clean(watch("nombre")),
    apellido: clean(watch("apellido")),
    dni: clean(watch("dni")),
    correo: clean(watch("correo")),
    telefono: clean(watch("telefono")),
    origenVisita: clean(watch("origenVisita")),
  });

  const CONTACT_FIELD_ORDER = ["nombre", "apellido", "dni", "correo", "telefono", "origenVisita"] as const;

  const validateContactoWithYup = async (): Promise<string | null> => {
    try {
      await formSchema.validate(getContactoValues(), { abortEarly: false });
      return null;
    } catch (e) {
      if (e instanceof Yup.ValidationError) {
        for (const k of CONTACT_FIELD_ORDER) {
          const found = e.inner.find(err => err.path === k);
          if (found) return found.message;
        }
        return e.errors[0] ?? "Revisá los datos.";
      }
      return "Revisá los datos.";
    }
  };

  const getInstitucionValues = () => ({
    institucion: (watch("institucion") ?? "").trim(),
    institucionLocalidad: (watch("institucionLocalidad") ?? "").trim(),
    institucionEmail: (watch("institucionEmail") ?? "").trim(),
    institucionTelefono: (watch("institucionTelefono") ?? "").trim(),
    responsableNombre: (watch("responsableNombre") ?? "").trim(),
    responsableApellido: (watch("responsableApellido") ?? "").trim(),
    responsableDni: (watch("responsableDni") ?? "").trim(),
  });

  const validateInstitucionWithYup = async (): Promise<string | null> => {
    try {
      await institucionSchema.validate(getInstitucionValues(), { abortEarly: true });
      return null;
    } catch (e) {
      return e instanceof Yup.ValidationError ? e.message : "Revisá los datos.";
    }
  };

  const getListadoValues = () => (watch("personas") ?? []) as Array<{ nombre: string; apellido: string; dni: string }>;

  const prettyArrayError = (e: Yup.ValidationError) => {
    if (e.path) {
      const m = e.path.match(/\[(\d+)\]\.(\w+)$/);
      if (m) {
        const idx = Number(m[1]) + 1;
        return `Visitante ${idx}: ${e.message}`;
      }
    }
    return e.message;
  };

  const getResponsableParticular = () => {
    const { nombre, apellido, dni } = getContactoValues();
    return { nombre, apellido, dni };
  };

  const getResponsableInstitucion = () => {
    const nombre = clean(watch("responsableNombre"));
    const apellido = clean(watch("responsableApellido"));
    const dni = clean(watch("responsableDni"));
    return { nombre, apellido, dni };
  };

  const composeVisitantes = (): Array<{ nombre: string; apellido: string; dni: string }> => {
    const base = getListadoValues();

    // Si la persona que reserva NO asiste, simplemente devolvemos el listado tal cual
    if (!watch("reservaAsiste")) {
      return base;
    }

    // Si asiste, según el tipo de visitante tomamos el responsable de un lado u otro
    const responsable =
      tipo === "INSTITUCION_EDUCATIVA"
        ? getResponsableInstitucion()
        : getResponsableParticular();

    // Pequeña defensa por si en algún flujo todavía no está seteado
    if (!responsable.nombre && !responsable.apellido && !responsable.dni) {
      return base;
    }

    // Opcional: evitar duplicados por DNI si lo agregaron también a mano en el listado
    const seen = new Set<string>();
    const all = [responsable, ...base];
    return all.filter(p => {
      const key = p.dni || `${p.nombre}-${p.apellido}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const guardedNext = async () => {
    const t = steps[safeIndex]?.type as StepType;
    if (t === "contacto") {
      const msg = await validateContactoWithYup();
      if (msg) { setUxError(msg); return; }
      setUxError(null);
      nextStep();
      return;
    }
    if (t === "institucion") {
      const msg = await validateInstitucionWithYup();
      if (msg) { setUxError(msg); return; }
      setUxError(null);
      nextStep();
      return;
    }
    if (t === "listado") {
      // const msg = await validateListadoWithYup(totalEsperado);
      const msg = await validateListadoWithYup(extraListado);
      if (msg) { setUxError(msg); return; }
      setUxError(null);
      nextStep();
      return;
    }
    const msg = validators[t]();
    if (msg) { setUxError(msg); return; }
    setUxError(null);
    nextStep();
  };


  useEffect(() => {
    if (!tipo) return;
    setUxError(null);
    if (tipo === "INSTITUCION_EDUCATIVA") {
      setValue("nombre", "");
      setValue("apellido", "");
      setValue("dni", "");
      setValue("correo", "");
      setValue("telefono", "");
      setValue("origenVisita", "");
    } else {
      setValue("institucion", "");
      setValue("institucionLocalidad", "");
      setValue("institucionEmail", "");
      setValue("institucionTelefono", "");
      setValue("responsableNombre", "");
      setValue("responsableApellido", "");
      setValue("responsableDni", "");
    }
    setValue("personas", []);
  }, [tipo, setValue]);

  type AppError = Error & { code?: string };
  function isAppError(e: unknown): e is AppError {
    return typeof e === "object" && e !== null && "message" in e;
  }

  const onSubmit = async (data: ReservationFormData) => {
    const contactoErr = tipo === "INSTITUCION_EDUCATIVA" ? null : await validateContactoWithYup();
    const institErr = tipo === "INSTITUCION_EDUCATIVA" ? await validateInstitucionWithYup() : null;
    // const listadoErr = await validateListadoWithYup(totalEsperado);
    const listadoErr = await validateListadoWithYup(extraListado);
    const necesidadesErr = validateNecesidades();
    const otros = [
      !watch("aceptaReglas") ? "Debés aceptar las políticas de visita." : null,
      !watch("fechaISO") ? "Falta la fecha de la reserva." : null,
    ];
    const errs = [contactoErr, institErr, listadoErr, necesidadesErr, ...otros].filter(Boolean) as string[];
    if (errs.length) { setUxError(errs[0]!); return; }

    try {
      setServerError(null);
      setSuccessMsg(null);
      setSubmitting(true);
      await submitReservation({
        ...data,
        totalPersonas,
        reservationDate: data.fechaISO!,
        visitantes: composeVisitantes(),
      });
      reset();
      setSuccessMsg("¡Reserva realizada con éxito!");
    } catch (e: unknown) {
      const err = isAppError(e) ? e : new Error("Error desconocido");
      if ((err as AppError).code === "DUPLICATE_DNI_DATE" || /DNI.+fecha/i.test(err.message ?? "")) {
        setServerError("Ya existe una reserva para ese DNI en esa fecha.");
        return;
      }
      setServerError(err.message || "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  const step = steps[safeIndex];

  return (
    <div className="flex flex-1 min-h-0 items-stretch bg-transparent">
      <form onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl text-left px-4 sm:px-6 py-6 text-main overflow-x-hidden"
      >
        {serverError && (
          <div className="mb-4 rounded-lg bg-red-600/20 border border-red-600 px-3 py-2 text-sm">
            {serverError}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={safeIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <StepHeader index={safeIndex + 1} title={step.label} />

            {step.type === "contacto" && (
              <ContactoStep register={register} watch={watch} setValue={setValue} uxError={uxError} />
            )}

            {step.type === "listado" && (
              <ListadoStep
                fields={fields}
                register={register}
                watch={watch}
                append={append}
                remove={remove}
                setValue={setValue}
                // totalEsperado={totalEsperado}
                totalEsperado={extraListado}
                tipo={tipo ?? null}
                uxError={uxError}
                onListChanged={onListadoMaybeFixed}
                reservaAsiste={reservaAsiste}
              />
            )}

            {step.type === "institucion" && tipo === "INSTITUCION_EDUCATIVA" && (
              <InstitucionStep register={register} watch={watch} setValue={setValue} uxError={uxError} />
            )}

            {step.type === "salud" && (
              <SaludStep
                register={register}
                watch={watch}
                setValue={setValue}
                totalPersonas={totalPersonas}
                uxError={uxError}
              />
            )}

            {step.type === "submit" && (
              <SubmitStep
                tipo={tipo ?? null}
                adultos={adultos}
                ninos={ninos}
                bebes={bebes}
                watch={watch}
                aceptaReglas={aceptaReglas}
                setValue={setValue}
                policiesUrl={POLICIES_URL}
                uxError={uxError}
                submitting={submitting}
                renderActions={false}
              />
            )}

            {/* Navegación */}
            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                onClick={prevStep}
                  className="px-4 py-2 w-28 md:w-36 sm:px-6 sm:py-3 rounded-lg border-2 border-button text-button hover:bg-white hover:text-gray-900 transition cursor-pointer"
              >
                Volver
              </button>

              <div className="ml-auto">
                {step.type === "submit" ? (
                  <button
                    type="submit"
                    disabled={submitting || !aceptaReglas}
                   className="px-4 py-2 w-28 md:w-36 sm:px-6 sm:py-3 rounded-lg bg-button text-white hover:opacity-90 transition disabled:opacity-40 cursor-pointer"
                  >
                    Enviar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={guardedNext}
                    className="px-4 py-2 w-28 md:w-36 sm:px-6 sm:py-3 rounded-lg bg-white text-button hover:bg-transparent hover:text-gray-900 hover:border-2 hover:border-button cursor-pointer"
                  >
                    Continuar
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </form>

      <SuccessModal
        open={!!successMsg}
        title={successMsg ?? "¡Listo!"}
        text="Vas a recibir la confirmación en tu email y WhatsApp en las próximas horas."
        primaryLabel="Volver al inicio"
        onPrimary={() => {
          setSuccessMsg(null);
          reset();
          router.replace(pathname, { scroll: false }); // limpia ?step=...
          onCancel?.(); // te devuelve al wizard/home
        }}
      />
    </div>
  );
}