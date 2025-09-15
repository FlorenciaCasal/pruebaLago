"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import StepHeader from "@/components/forms/StepHeader";
import PolicyCheckbox from "@/components/forms/PolicyCheckbox";
import { inputBase } from "@/styles/ui";
import { useReservationForm } from "@/hooks/useReservationForm";
import { submitReservation } from "@/services/reservations";
import type { ReservationFormData } from "@/types/reservation";
import { useFieldArray } from "react-hook-form";
import SaludStep from "./forms/SaludStep";
import ConocisteStep from "./forms/ConocisteStep";
import SuccessModal from "@/components/SuccessModal";
import type { CircuitoKey } from "@/types/reservation";

const POLICIES_URL = "/politicas-de-visita";

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
        register, handleSubmit, watch, setValue, adultos, ninos, bebes, control,
        validateConociste, reset,
    } = useReservationForm();

    const { fields, append, remove } = useFieldArray({ name: "personas", control });

    const aceptaReglas = watch("aceptaReglas") ?? false;
    // const comoNosConociste = watch("comoNosConociste");
    const tipoVisitante = watch("tipoVisitante");

    // --- 3) URL → precarga desde el Wizard ---
    const tipoFromQS = (() => {
        const t = searchParams.get("visitorType");
        return t === "PARTICULAR" || t === "INSTITUCION_EDUCATIVA" ? t : null;
    })();

    // este es el valor “efectivo” que usamos para decidir los pasos
    const tipo = tipoFromQS ?? tipoVisitante;

    const totalWizard = (adultos ?? 0) + (ninos ?? 0) + (bebes ?? 0);
    const totalEsperado = Math.max(0, totalWizard - 1);

    useEffect(() => {
        const fechaQS = searchParams.get("fecha");          // ISO
        if (fechaQS) setValue("fechaISO", fechaQS, { shouldDirty: true });

        // si vino visitorType en la URL y es distinto al que está en el form, lo seteamos
        if (tipoFromQS && watch("tipoVisitante") !== tipoFromQS) {
            setValue("tipoVisitante", tipoFromQS, { shouldDirty: true });
        }

        // ← OJO: nombres iguales a los que mandás desde HomePage
        const ad = Number(searchParams.get("adults") ?? "0");
        const ni = Number(searchParams.get("kids") ?? "0");
        const be = Number(searchParams.get("babies") ?? "0");

        setValue("adultos", Math.max(0, ad), { shouldDirty: true });
        setValue("ninos", Math.max(0, ni), { shouldDirty: true });
        setValue("bebes", Math.max(0, be), { shouldDirty: true });

        // circuito ya no se usa acá, pero si querés persistirlo para el submit final:
        const circuitQS = searchParams.get("circuito");
        if (circuitQS) setValue("circuito", circuitQS as CircuitoKey, { shouldDirty: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, tipoFromQS, setValue, watch]);

    // --- 1) VALIDACIONES ---

    const validateContacto = () => {
        const req = (k: keyof ReservationFormData, msg: string) => ((watch(k) ?? "").toString().trim() ? null : msg);
        return (
            req("nombre", "Completá tu nombre.") ||
            req("apellido", "Completá tu apellido.") ||
            req("dni", "Completá tu DNI.") ||
            req("correo", "Completá tu email.") ||
            req("telefono", "Completá tu teléfono.") ||
            req("origenVisita", "Contanos desde dónde nos visitás.")
        );
    };

    // ── VALIDADORES PARA INSTITUCIÓN ──────────────────────────────────────────────
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


    type StepType = "contacto" | "institucion" | "listado" | "salud" | "conociste" | "submit";

    const validators: Record<StepType, () => string | null> = {
        contacto: validateContacto,
        institucion: validateInstitucion,
        listado: validateListado,
        salud: validateNecesidades,     // solo movilidad/alergias
        conociste: validateConociste,
        submit: () => null,
    };

    const steps = useMemo(() => {
        if (tipo === "INSTITUCION_EDUCATIVA") {
            return [
                { label: "Datos de la institución y responsable", type: "institucion" as const },
                { label: "Listado de visitantes", type: "listado" as const },
                // { label: "¿Cómo te enteraste de nuestra existencia?", type: "conociste" as const },
                { label: "Datos de salud o movilidad", type: "salud" as const },
                { label: "Encuesta rápida", type: "conociste" as const },
                { label: "Revisión y envío", type: "submit" as const },
            ] as const;
        }
        // Particular (cuando tipo === "PARTICULAR")
        return [
            { label: "Datos de la persona que hace la reserva", type: "contacto" as const },
            { label: "Acompañantes", type: "listado" as const },
            // { label: "¿Cómo te enteraste de nuestra existencia?", type: "conociste" as const },
            { label: "Datos de salud o movilidad", type: "salud" as const },
            { label: "Encuesta rápida", type: "conociste" as const },
            { label: "Revisión y envío", type: "submit" as const },
        ] as const;
    }, [tipo]);

    // Reset al cambiar tipo (por si el usuario vuelve atrás en el wizard)
    useEffect(() => { setCurrentStep(0); }, [tipo]);

    useEffect(() => {
        if (successMsg) return; // ← pausa mientras hay modal
        const sp = new URLSearchParams(searchParams);
        const currentInUrl = sp.get("step") ?? "0";
        const next = String(currentStep);
        if (currentInUrl !== next) {
            sp.set("step", next);
            router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
        }
    }, [currentStep, searchParams, pathname, router, successMsg]);

    const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

    const guardedNext = () => {
        const t = steps[currentStep].type;
        const msg = validators[t]();
        if (msg) { setUxError(msg); return; }
        setUxError(null);
        nextStep();
    };

    // --- 4) SUBMIT ---
    const onSubmit = async (data: ReservationFormData) => {
        const errs = (
            tipo === "INSTITUCION_EDUCATIVA"
                ? [validateInstitucion(), validateListado(), validateNecesidades()]
                : [validateContacto(), validateListado(), validateNecesidades()]
        )
            .concat([
                !watch("aceptaReglas") ? "Debés aceptar las políticas de visita." : null,
                !watch("fechaISO") ? "Falta la fecha de la reserva." : null,
            ])
            .filter(Boolean) as string[];

        if (errs.length) { setUxError(errs[0]!); return; }

        try {
            setServerError(null);
            setSuccessMsg(null);
            setSubmitting(true);

            await submitReservation({
                ...data,
                totalPersonas: totalWizard,          // lo que vino del Wizard
                reservationDate: data.fechaISO!,
            });
            // 👉 MOSTRAR MODAL: seteamos el estado
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

                        {/* Step 1: CONTACTO (siempre) */}
                        {steps[currentStep].type === "contacto" && (
                            <div className="space-y-4 rounded-xl bg-white/5 border border-white/10 p-4">
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block mb-1">Nombre</label>
                                        <input {...register("nombre")} className={inputBase} />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Apellido</label>
                                        <input {...register("apellido")} className={inputBase} />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block mb-1">DNI</label>
                                        <input {...register("dni")} className={inputBase} />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Email</label>
                                        <input {...register("correo")} className={inputBase} />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block mb-1">Teléfono</label>
                                        <input {...register("telefono")} className={inputBase} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block mb-1">¿Desde dónde nos visitás?</label>
                                        <input {...register("origenVisita")} className={inputBase} placeholder="Ej. Córdoba, AR" />
                                    </div>
                                </div>

                                {uxError && <p className="text-red-400 text-sm">{uxError}</p>}
                            </div>
                        )}

                        {/* Step 2: DETALLE (condicional) */}
                        {steps[currentStep].type === "listado" && (
                            <div className="space-y-4">
                                {/* <h3 className="text-lg font-semibold">
                                    {tipo === "INSTITUCION_EDUCATIVA" ? "Listado de visitantes" : "Acompañantes"}
                                </h3> */}
                                <p className="text-xs">No incluyas a la persona que reserva, la misma ya fue cargada en el paso anterior.</p>

                                {/* mini form para agregar */}
                                <div className="rounded-lg border border-white/20 bg-white/5 p-4 space-y-3">
                                    <input {...register("tmpNombreApe")} placeholder="Nombre y apellido" className={inputBase} />
                                    <input {...register("tmpDni")} placeholder="DNI" className={inputBase} />
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-900 px-4 py-2"
                                        onClick={() => {
                                            const na = (watch("tmpNombreApe") ?? "").toString().trim();
                                            const dni = (watch("tmpDni") ?? "").toString().trim();
                                            if (!na || !dni) { setUxError("Completá nombre/apellido y DNI."); return; }
                                            const parts = na.split(/\s+/).filter(Boolean);
                                            if (parts.length < 2) { setUxError("Ingresá nombre y apellido."); return; }
                                            const [nombre, ...rest] = parts;
                                            const apellido = rest.join(" ");
                                            append({ nombre, apellido, dni });
                                            setValue("tmpNombreApe", "");
                                            setValue("tmpDni", "");
                                            setUxError(null);
                                        }}
                                    >
                                        Agregar
                                    </button>
                                </div>

                                {/* tabla */}
                                <div className="rounded-lg border border-white/20 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-white/10">
                                            <tr>
                                                <th className="text-left px-3 py-2">#</th>
                                                <th className="text-left px-3 py-2">Nombre</th>
                                                <th className="text-left px-3 py-2">DNI</th>
                                                <th className="text-left px-3 py-2">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fields.length === 0 && (
                                                <tr><td className="px-3 py-3 text-white/60" colSpan={4}>
                                                    {tipo === "INSTITUCION_EDUCATIVA" ? "Sin visitantes cargados." : "Sin acompañantes aún."}
                                                </td></tr>
                                            )}
                                            {fields.map((f, i) => (
                                                <tr key={f.id ?? i} className="border-t border-white/10">
                                                    <td className="px-3 py-2">{i + 1}</td>
                                                    <td className="px-3 py-2">
                                                        {(watch(`personas.${i}.nombre`) ?? "") + " " + (watch(`personas.${i}.apellido`) ?? "")}
                                                    </td>
                                                    <td className="px-3 py-2">{watch(`personas.${i}.dni`)}</td>
                                                    <td className="px-3 py-2">
                                                        <button type="button" className="text-red-300 hover:underline" onClick={() => remove(i)}>Quitar</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <p className="mt-2 rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80">
                                    Total esperado: <b>{totalEsperado}</b> — Cargados: <b>{fields.length}</b>
                                </p>

                                {uxError && <p className="text-red-400 text-sm">{uxError}</p>}
                            </div>
                        )}


                        {steps[currentStep].type === "institucion" && tipo === "INSTITUCION_EDUCATIVA" && (
                            <div className="space-y-4">


                                <div className="grid sm:grid-cols-2 gap-3">
                                    <input {...register("institucion")} placeholder="Nombre de la institución" className={inputBase} />
                                    <input {...register("institucionLocalidad")} placeholder="Localidad" className={inputBase} />
                                    <input {...register("institucionEmail")} placeholder="Email" className={inputBase} />
                                    <input {...register("institucionTelefono")} placeholder="Teléfono" className={inputBase} />
                                </div>

                                <div className="grid sm:grid-cols-3 gap-3">
                                    <input {...register("responsableNombre")} placeholder="Nombre (responsable)" className={inputBase} />
                                    <input {...register("responsableApellido")} placeholder="Apellido (responsable)" className={inputBase} />
                                    <input {...register("responsableDni")} placeholder="DNI (responsable)" className={inputBase} />
                                </div>

                                {uxError && <p className="text-red-400 text-sm">{uxError}</p>}
                            </div>
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

                        {/* Step 4: SUBMIT */}
                        {steps[currentStep].type === "submit" && (
                            <div className="space-y-4">
                                {uxError && (
                                    <div className="rounded-md bg-red-600/20 border border-red-600 px-3 py-2 text-sm">
                                        {uxError}
                                    </div>
                                )}

                                {/* RESUMEN */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {/* Reserva */}
                                    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                                        <div className="text-sm text-white/60 mb-2">Reserva</div>
                                        <div className="space-y-1 text-sm">
                                            <div><b>Tipo:</b> {tipo === "INSTITUCION_EDUCATIVA" ? "Institución educativa" : "Particular"}</div>
                                            <div><b>Fecha:</b> {watch("fechaISO") || "—"}</div>
                                            <div><b>Total:</b> {(adultos ?? 0) + (ninos ?? 0) + (bebes ?? 0)}</div>
                                        </div>
                                    </div>

                                    {/* Contacto / Institución */}
                                    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                                        <div className="text-sm text-white/60 mb-2">{tipo === "INSTITUCION_EDUCATIVA" ? "Institución" : "Contacto"}</div>
                                        {tipo === "INSTITUCION_EDUCATIVA" ? (
                                            <div className="space-y-1 text-sm">
                                                <div><b>Institución:</b> {watch("institucion") || "—"}</div>
                                                <div><b>Localidad:</b> {watch("institucionLocalidad") || "—"}</div>
                                                <div><b>Email:</b> {watch("institucionEmail") || "—"}</div>
                                                <div><b>Teléfono:</b> {watch("institucionTelefono") || "—"}</div>
                                                <div className="pt-2"><b>Responsable:</b> {`${watch("responsableNombre") || ""} ${watch("responsableApellido") || ""}`.trim() || "—"} (DNI {watch("responsableDni") || "—"})</div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1 text-sm">
                                                <div><b>Nombre:</b> {`${watch("nombre") || ""} ${watch("apellido") || ""}`.trim() || "—"}</div>
                                                <div><b>DNI:</b> {watch("dni") || "—"}</div>
                                                <div><b>Email:</b> {watch("correo") || "—"}</div>
                                                <div><b>Teléfono:</b> {watch("telefono") || "—"}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Políticas */}
                                <PolicyCheckbox
                                    href={POLICIES_URL}
                                    checked={aceptaReglas}
                                    onChange={(v) => setValue("aceptaReglas", v, { shouldDirty: true })}
                                />
                            </div>
                        )}

                        {/* Navegación */}
                        <div className="mt-10 flex items-center gap-3">
                            {currentStep > 0 && (
                                <button type="button" onClick={prevStep}
                                    className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg border border-white/80 text-white hover:bg-white hover:text-gray-900 transition">
                                    Volver
                                </button>
                            )}

                            <div className="ml-auto">
                                {currentStep < steps.length - 1 ? (
                                    <button type="button" onClick={guardedNext}
                                        className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-white text-gray-900 hover:opacity-90 transition">
                                        Continuar
                                    </button>
                                ) : (
                                    <button type="submit" disabled={!aceptaReglas || submitting}
                                        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-white text-gray-900 transition
                    ${(!aceptaReglas || submitting) ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}>
                                        {submitting ? "Enviando..." : "Enviar"}
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
                noButtons
            />

        </div>
    );
}



