"use client";
import { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import StepHeader from "@/components/forms/StepHeader";
import { useReservationForm } from "@/hooks/useReservationForm";
import { submitReservation } from "@/services/reservations";
import type { ReservationFormData } from "@/types/reservation";
import { useFieldArray } from "react-hook-form";
import SaludStep from "../forms/SaludStep";
import ConocisteStep from "../forms/ConocisteStep";
import SuccessModal from "@/components/SuccessModal";
import { POLICIES_URL } from "./constants";
import { useRegisterPrefillFromQS } from "./hooks/useRegisterPrefillFromQS";
import { useRegisterUrlSync } from "./hooks/useRegisterUrlSync";
import ContactoStep from "./steps/ContactoStep";
import ListadoStep from "./steps/ListadoStep";
import InstitucionStep from "./steps/InstitucionStep";
import SubmitStep from "./steps/SubmitStep";
import { isVisitante, type Visitante } from "@/utils/visitante";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/schemas/registerSchema";


const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '’-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
const DNI_RE = /^\d{8}$/;                 // 👈 exacto 8 dígitos
const PHONE_RE = /^[0-9+()\-.\s]{8,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LETTERS_LEN = (s: string) =>
    s.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "").length;
const clean = (v: unknown) => String(v ?? "").trim();



export default function RegisterForm() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(0);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [uxError, setUxError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);


    const {
        register,
        handleSubmit,
        watch,
        setValue,
        adultos,
        ninos,
        bebes,
        control,
        validateConociste,
        reset,
    } = useReservationForm();

    const { fields, append, remove } = useFieldArray({ name: "personas", control });

    const aceptaReglas = watch("aceptaReglas") ?? false;
    const tipoVisitante = watch("tipoVisitante"); // puede ser string | undefined

    // Precarga desde QS
    const { tipoFromQS } = useRegisterPrefillFromQS(searchParams, setValue, watch);
    // 👇 aseguramos que 'tipo' sea Visitante | null
    const tipo: Visitante | null = useMemo(() => {
        if (tipoFromQS) return tipoFromQS;
        return isVisitante(tipoVisitante) ? tipoVisitante : null;
    }, [tipoFromQS, tipoVisitante]);

    const totalWizard = (adultos ?? 0) + (ninos ?? 0) + (bebes ?? 0);
    const totalEsperado = Math.max(0, totalWizard - 1);

    // Reset de step al cambiar tipo
    // (el efecto original era un useEffect: setCurrentStep(0); lo mantenemos con setState directo al detectar cambio)
    // Como no tenemos dependency hook aquí, lo hacemos vía memo var de steps.
    type StepType = "contacto" | "institucion" | "listado" | "salud" | "conociste" | "submit";

    const steps = useMemo(() => {
        // cuando cambia el tipo, volvemos a 0
        setCurrentStep(0);

        if (tipo === "INSTITUCION_EDUCATIVA") {
            return [
                { label: "Datos de la institución y responsable", type: "institucion" as const },
                { label: "Listado de visitantes", type: "listado" as const },
                { label: "Datos de salud o movilidad", type: "salud" as const },
                { label: "Encuesta rápida", type: "conociste" as const },
                { label: "Revisión y envío", type: "submit" as const },
            ] as const;
        }
        return [
            { label: "Datos de la persona que hace la reserva", type: "contacto" as const },
            { label: "Acompañantes", type: "listado" as const },
            { label: "Datos de salud o movilidad", type: "salud" as const },
            { label: "Encuesta rápida", type: "conociste" as const },
            { label: "Revisión y envío", type: "submit" as const },
        ] as const;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tipo]);

    // Validaciones (idénticas a tu versión)
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
        if (!DNI_RE.test(dni)) return "DNI inválido: deben ser exactamente 8 dígitos.";  // 👈

        if (!correo) return "Completá tu email.";
        if (!EMAIL_RE.test(correo)) return "Email inválido.";

        if (!telefono) return "Completá tu teléfono.";
        if (!PHONE_RE.test(telefono)) return "Teléfono inválido.";

        if (!origenVisita) return "Contanos desde dónde nos visitás.";
        if (/\d/.test(origenVisita)) return "El origen no debe incluir números.";   
        if (LETTERS_LEN(origenVisita) < 3) return "Origen inválido: mínimo 3 letras.";      // 👈

        return null;
    };


    const validateInstitucion = () => {
        const inst = (watch("institucion") ?? "").trim();
        const localidad = (watch("institucionLocalidad") ?? "").trim();
        const mail = (watch("institucionEmail") ?? "").trim();
        const tel = (watch("institucionTelefono") ?? "").trim();
        const respNom = (watch("responsableNombre") ?? "").trim();
        const respApe = (watch("responsableApellido") ?? "").trim();
        const respDni = (watch("responsableDni") ?? "").trim();
        if (!inst || !localidad || !mail || !tel || !respNom || !respApe || !respDni) {
            return "Completá los datos de la institución y del responsable.";
        }
        return null;
    };

    const validateListado = () => {
        if (fields.length !== totalEsperado) {
            return `Debés cargar ${totalEsperado} visitante${totalEsperado === 1 ? "" : "s"}.`;
        }
        const falta = fields.findIndex((_, i) => {
            const n = (watch(`personas.${i}.nombre`) ?? "").trim();
            const a = (watch(`personas.${i}.apellido`) ?? "").trim();
            const d = (watch(`personas.${i}.dni`) ?? "").trim();
            return !n || !a || !d;
        });
        return falta >= 0 ? `Completá nombre, apellido y DNI del visitante ${falta + 1}.` : null;
    };

    const validateNecesidades = () => {
        const total = (adultos ?? 0) + (ninos ?? 0) + (bebes ?? 0);
        const mov = Number(watch("movilidadReducida") ?? 0);
        const alergias = (watch("alergias") ?? "no") as "si" | "no";
        const alergicos = Number(watch("alergicos") ?? 0);
        if (mov < 0 || mov > total) return "Cantidad con movilidad reducida inválida.";
        if (alergias === "si" && alergicos <= 0) return "Cantidad de alérgicos requerida.";
        return null;
    };

    const validators: Record<StepType, () => string | null> = {
        contacto: validateContacto,
        institucion: validateInstitucion,
        listado: validateListado,
        salud: validateNecesidades,
        conociste: validateConociste,
        submit: () => null,
    };

    const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

    const guardedNext = () => {
        const t = steps[currentStep].type as StepType;
        const msg = validators[t]();
        if (msg) { setUxError(msg); return; }
        setUxError(null);
        nextStep();
    };

    // Sincronización de URL
    useRegisterUrlSync({
        currentStep,
        successMsg,
        pathname,
        routerReplace: (url) => router.replace(url, { scroll: false }),
        searchParams,
        tipo,                                 // 👈 ahora matchea el tipo esperado
        fechaISO: watch("fechaISO"),
        // circuito: watch("circuito") as string | null,
        adultos, ninos, bebes,
    });

    // Submit idéntico
    const onSubmit = async (data: ReservationFormData) => {
        const errs = (
            tipo === "INSTITUCION_EDUCATIVA"
                ? [validateInstitucion(), validateListado(), validateNecesidades()]
                : [validateContacto(), validateListado(), validateNecesidades()]
        ).concat([
            !watch("aceptaReglas") ? "Debés aceptar las políticas de visita." : null,
            !watch("fechaISO") ? "Falta la fecha de la reserva." : null,
        ]).filter(Boolean) as string[];

        if (errs.length) { setUxError(errs[0]!); return; }

        try {
            setServerError(null);
            setSuccessMsg(null);
            setSubmitting(true);

            await submitReservation({
                ...data,
                totalPersonas: totalWizard,
                reservationDate: data.fechaISO!,
            });

            reset();
            setSuccessMsg("¡Reserva realizada con éxito!");
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Error inesperado");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl text-left px-4 sm:px-6 py-10 text-white overflow-x-hidden">
                {serverError && (
                    <div className="mb-4 rounded-lg bg-red-600/20 border border-red-600 px-3 py-2 text-sm">
                        {serverError}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <StepHeader index={currentStep + 1} title={steps[currentStep].label} />

                        {steps[currentStep].type === "contacto" && (
                            <ContactoStep register={register} uxError={uxError} />
                        )}

                        {steps[currentStep].type === "listado" && (
                            <ListadoStep
                                fields={fields}
                                register={register}
                                watch={watch}
                                append={append}
                                remove={remove}
                                setValue={setValue}
                                totalEsperado={totalEsperado}
                                tipo={tipo ?? null}
                                uxError={uxError}
                            />
                        )}

                        {steps[currentStep].type === "institucion" && tipo === "INSTITUCION_EDUCATIVA" && (
                            <InstitucionStep register={register} uxError={uxError} />
                        )}

                        {steps[currentStep].type === "salud" && (
                            <SaludStep
                                register={register}
                                watch={watch}
                                setValue={setValue}
                                totalPersonas={(adultos ?? 0) + (ninos ?? 0) + (bebes ?? 0)}
                                uxError={uxError}
                            />
                        )}

                        {steps[currentStep].type === "conociste" && (
                            <ConocisteStep
                                register={register}
                                watch={watch}
                                setValue={setValue}
                                uxError={uxError}
                            />
                        )}

                        {steps[currentStep].type === "submit" && (
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
                            />
                        )}

                        {/* Navegación */}
                        <div className="mt-10 flex items-center gap-3">
                            {currentStep > 0 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg border border-white/80 text-white hover:bg-white hover:text-gray-900 transition"
                                >
                                    Volver
                                </button>
                            )}
                            {steps[currentStep].type !== "submit" && (
                                <div className="ml-auto">
                                    <button
                                        type="button"
                                        onClick={guardedNext}
                                        className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-white text-gray-900 hover:opacity-90 transition"
                                    >
                                        Continuar
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </form>

            <SuccessModal
                open={!!successMsg}
                title={successMsg ?? "¡Listo!"}
                text="Vas a recibir la confirmación en tu email y WhatsApp en las próximas horas."
                noButtons
            />
        </div>
    );
}




