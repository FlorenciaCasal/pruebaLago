"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import StepHeader from "@/components/forms/StepHeader";
import Counter from "@/components/forms/Counter";
import PolicyCheckbox from "@/components/forms/PolicyCheckbox";
import { inputBase, textareaBase, radioCard, radioHidden, radioBadge } from "@/styles/ui";
import { useReservationForm } from "@/hooks/useReservationForm";
import { submitReservation } from "@/services/reservations";
import type { ReservationFormData } from "@/types/reservation";
import { useFieldArray } from "react-hook-form";
import CalendarPicker from "@/components/CalendarPicker";


const POLICIES_URL = "/politicas-de-visita";

export default function RegisterForm() {
    // navegación / url
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const {
        register, handleSubmit, watch, setValue, control,
        adultos14, menores14, movilidadReducida, totalPersonas,
        setAdultos, setMenores, setMovilidad,
        validateGroup, validateOrigen, validateConociste,
    } = useReservationForm();

    const { fields, append, remove, replace } = useFieldArray({ name: "personas", control });

    const aceptaReglas = watch("aceptaReglas") ?? false;
    const alergias = watch("alergias");
    const origenVisita = (watch("origenVisita") ?? "").trim();
    const comoNosConociste = watch("comoNosConociste");
    const circuitos = [
        { key: "A", titulo: "Circuito Panorámico", img: "/img/circuito1.jpg" },
        { key: "B", titulo: "Circuito de Senderos", img: "/img/circuito2.jpg" },
        { key: "C", titulo: "Circuito de Senderos", img: "/img/circuito3.jpg" },
        { key: "D", titulo: "Circuito de Senderos", img: "/img/circuito4.jpg" },
    ] as const;
    // dentro del componente
    const circuito = watch("circuito");
    const fechaISO = watch("fechaISO");

    const validateCircuito = () => (circuito ? null : "Elegí un circuito para continuar.");
    const validateFecha = () => (fechaISO ? null : "Seleccioná una fecha del calendario.");



    const steps = [
        { label: "¿Qué circuito te interesa realizar?", type: "circuito" as const },
        { label: "Seleccioná la fecha de tu visita", type: "fecha" as const },
        { label: "Por favor, completa tus datos personales", type: "text" as const },
        { label: "¿Cuántas personas son?", type: "group" as const },
        { label: "¿Desde dónde nos visitás?", type: "origen" as const },
        { label: "¿Cómo te enteraste de nuestra existencia?", type: "conociste" as const },
        { label: "Revisión y envío", type: "submit" as const },
    ];

    // leer step inicial desde la URL, con clamp de seguridad
    const stepFromUrl = Number(searchParams.get("step") ?? "0");
    const initialStep = Number.isFinite(stepFromUrl)
        ? Math.min(Math.max(0, stepFromUrl), steps.length - 1)
        : 0;

    const [currentStep, setCurrentStep] = useState<number>(initialStep);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [uxError, setUxError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // cada vez que cambie el step, lo escribimos en la URL sin empujar historial
    useEffect(() => {
        const sp = new URLSearchParams(searchParams.toString());
        sp.set("step", String(currentStep));
        router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]); // solo cuando cambia el step

    const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

    const validators: Record<(typeof steps)[number]['type'], () => string | null> = {
        circuito: validateCircuito,
        fecha: validateFecha,
        text: () => null,
        group: validateGroup,
        origen: validateOrigen,
        conociste: validateConociste,
        submit: () => null,
    };

    const guardedNext = () => {
        const t = steps[currentStep].type;
        const v = validators[t];
        const msg = v ? v() : null;
        if (msg) { setUxError(msg); return; }
        setUxError(null);
        nextStep();
    };


    useEffect(() => {
        const desired = Math.max(0, totalPersonas - 1);
        const current = fields.length;

        if (current === desired) return;

        if (current > desired) {
            // recortar desde el final
            for (let i = current - 1; i >= desired; i--) remove(i);
        } else {
            // agregar los que falten
            const toAdd = desired - current;
            const blanks = Array.from({ length: toAdd }, () => ({ nombre: "", apellido: "", dni: "" }));
            append(blanks);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalPersonas]);

    const onSubmit = async (data: ReservationFormData) => {
        const errs = [
            validateCircuito(),
            validateFecha(),
            validateGroup(),
            validateOrigen(),
            validateConociste()
        ].filter(Boolean) as string[];

        if (errs.length) { setUxError(errs[0]!); return; }

        try {
            setServerError(null);
            setSuccessMsg(null);
            setSubmitting(true);

            await submitReservation({
                ...data,
                totalPersonas,
                reservationDate: data.fechaISO!, // ← del form
            });

            setSuccessMsg("¡Reserva realizada con éxito!");
        } catch (err: unknown) {
            console.error(err);
            setServerError(err instanceof Error ? err.message : "Error inesperado");
        } finally {
            setSubmitting(false);
        }
    };


    // Success screen
    if (successMsg) {
        return (
            <div className="flex w-full items-center justify-center min-h-screen bg-gray-900 text-white px-4">
                <div className="w-full max-w-xl">
                    <div className="mb-4 rounded-lg bg-green-600/20 border border-green-600 px-4 py-3">
                        <h2 className="text-xl font-semibold">{successMsg}</h2>
                        <p className="mt-1 text-sm text-gray-200">
                            Te enviaremos un recordatorio <b>48 horas antes</b> para confirmar tu llegada.
                            Recordá llegar <b>15 minutos antes</b> del horario indicado. ¡Nos vemos pronto! ✨
                        </p>
                    </div>
                    <div className="rounded-2xl bg-gray-850/40 p-5 space-y-3">
                        <h3 className="text-lg font-semibold">Recordatorios y recomendaciones:</h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-200">
                            <li>Traé ropa cómoda.</li>
                            <li>Podés traerte una botella recargable de agua.</li>
                            <li>Traer gorro y protector solar.</li>
                            <li>No se permiten mascotas.</li>
                            <li>Y tené en cuenta que: No contamos con servicio de venta de alimentos.</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // Form
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

                        {steps[currentStep].type === "text" && (
                            <div className="space-y-3">
                                <input {...register("nombre")} placeholder="Nombre" className={inputBase} />
                                <input {...register("apellido")} placeholder="Apellido(s)" className={inputBase} />
                                <input {...register("dni")} placeholder="DNI" className={inputBase} />
                                <input {...register("telefono")} placeholder="Número de teléfono" className={inputBase} />
                                <input {...register("correo")} placeholder="Correo electrónico" className={inputBase} />
                            </div>
                        )}


                        {steps[currentStep].type === "circuito" && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {circuitos.map(({ key, titulo, img }, i) => {
                                        const letter = String.fromCharCode(65 + i);
                                        return (
                                            <label
                                                key={key}
                                                className={`${radioCard} flex-col items-center text-center gap-3`} // ← fuerza columna
                                            >
                                                {/* input oculto (peer) */}
                                                <input
                                                    type="radio"
                                                    value={key}
                                                    className={radioHidden} // sr-only peer
                                                    {...register("circuito")}
                                                    onChange={() => {
                                                        setValue("circuito", key, { shouldDirty: true, shouldValidate: true });
                                                        setUxError(null);
                                                        nextStep();
                                                    }}
                                                />

                                                {/* Contenido en 2 filas: [imagen crece] / [texto fijo abajo] */}
                                                <div className="w-full grid grid-rows-[1fr_auto] gap-2
                                                peer-checked:[&_.badge]:bg-white peer-checked:[&_.badge]:text-gray-900 peer-checked:[&_.badge]:border-gray-900">
                                                    {/* fila 1: IMAGEN — centrada, sin recorte, alto fijo por breakpoint */}
                                                    <div className="h-44 sm:h-56 md:h-64 flex items-center justify-center overflow-hidden rounded-lg p-1 md:p-1.5">
                                                        <img
                                                            src={img}
                                                            alt={`Imagen del ${titulo}`}
                                                            className="block max-w-full max-h-full object-contain mx-auto"
                                                            loading="lazy"
                                                            decoding="async"
                                                        />
                                                    </div>

                                                    {/* fila 2: LETRA + NOMBRE — siempre abajo */}
                                                    <div className="inline-flex items-center justify-center gap-2">
                                                        <span className={`${radioBadge} badge`} aria-hidden="true">{letter}</span>
                                                        <span className="font-medium">{titulo}</span>
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>

                                {uxError && <p className="text-red-400 text-sm">{uxError}</p>}
                            </div>
                        )}



                        {steps[currentStep].type === "fecha" && (
                            <div className="space-y-3">
                                <div className="mx-auto w-full">
                                    <CalendarPicker
                                        selectedISO={fechaISO}
                                        onSelectISO={(iso) => {
                                            setValue("fechaISO", iso, { shouldDirty: true });
                                            setUxError(null);
                                            nextStep();
                                        }}
                                    />
                                </div>
                                <p className="text-sm text-white/80">
                                    {watch("fechaISO") ? `Fecha seleccionada: ${watch("fechaISO")}` : "Elegí un día del calendario"}
                                </p>
                                {uxError && <p className="text-red-400 text-sm">{uxError}</p>}
                            </div>
                        )}



                        {steps[currentStep].type === "group" && (
                            <div className="space-y-4">
                                {/* Counters */}
                                <Counter
                                    label="De 14 años o más (incluyéndote)"
                                    value={adultos14}
                                    onChange={setAdultos}
                                    min={1}
                                    disableMinusWhenMin
                                />
                                <Counter
                                    label="Menores de 14"
                                    value={menores14}
                                    onChange={setMenores}
                                    min={0}
                                />
                                <Counter
                                    label="¿Cuántas tienen movilidad reducida?"
                                    description="De las personas que ingresaste"
                                    value={movilidadReducida}
                                    onChange={setMovilidad}
                                    min={0}
                                    max={totalPersonas}
                                />

                                {/* Errores UX */}
                                {uxError && (
                                    <div className="rounded-lg bg-yellow-600/20 border border-yellow-600 px-3 py-2 text-sm">
                                        {uxError}
                                    </div>
                                )}

                                {/* Alergias */}
                                <div className="mt-2">
                                    <p className="font-normal sm:font-semibold mb-2">¿Alguno de los acompañantes es alérgico?</p>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value="no" {...register("alergias")} className={radioHidden} defaultChecked />
                                            <span className={radioBadge}>N</span>
                                            <span>No</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value="si" {...register("alergias")} className={radioHidden} />
                                            <span className={radioBadge}>S</span>
                                            <span>Sí</span>
                                        </label>
                                    </div>

                                    {watch("alergias") === "si" && (
                                        <textarea
                                            {...register("detalleAlergias")}
                                            placeholder="Contanos quiénes son y a qué son alérgicos"
                                            className={textareaBase}
                                            rows={3}
                                        />
                                    )}
                                </div>

                                {/* Comentarios libres */}
                                <div>
                                    <label className="block mb-2 font-normal sm:font-semibold">
                                        ¿Querés agregar algún comentario o algo que debamos saber?
                                    </label>
                                    <textarea
                                        {...register("comentarios")}
                                        placeholder="Ej: una persona se marea fácil; llegamos con cochecito; necesitamos ayuda al llegar..."
                                        className={textareaBase}
                                        rows={3}
                                    />
                                </div>

                                {/* Acompañantes (solo si hay) */}
                                {totalPersonas > 1 && (
                                    <div className="space-y-3">
                                        <p className="font-semibold">Detalles individuales (acompañantes)</p>

                                        <div className="space-y-2">
                                            {fields.map((field, idx) => (
                                                <details
                                                    key={field.id ?? idx}
                                                    className="rounded-md border border-white/20 open:border-white/40 transition"
                                                >
                                                    {/* <summary className="cursor-pointer select-none px-4 py-3 bg-white/5 hover:bg-white/10 rounded-md">
                                                        Acompañante {idx + 1}
                                                    </summary> */}
                                                    <summary className="cursor-pointer select-none px-4 py-3 bg-white/5 hover:bg-white/10 rounded-md text-sm sm:text-base">
                                                        Acompañante {idx + 1}
                                                    </summary>


                                                    <div className="px-4 py-3 space-y-3">
                                                        <input
                                                            {...register(`personas.${idx}.nombre` as const)}
                                                            placeholder="Nombre"
                                                            className={inputBase}
                                                        />
                                                        <input
                                                            {...register(`personas.${idx}.apellido` as const)}
                                                            placeholder="Apellido(s)"
                                                            className={inputBase}
                                                        />
                                                        <input
                                                            {...register(`personas.${idx}.dni` as const)}
                                                            placeholder="DNI"
                                                            className={inputBase}
                                                        />
                                                    </div>
                                                </details>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                        {steps[currentStep].type === "origen" && (
                            <div className="space-y-3">
                                <input
                                    {...register("origenVisita")}
                                    placeholder="Escribí aquí tu respuesta…"
                                    className={inputBase}
                                />
                                {/* {uxError && <p className="text-yellow-400 text-sm">{uxError}</p>} */}
                                {uxError && <p className="text-red-400 text-sm">{uxError}</p>}
                            </div>
                        )}

                        {steps[currentStep].type === "conociste" && (
                            <div className="space-y-3">
                                <div className="grid gap-3">
                                    {[
                                        { v: "redes", t: "Redes sociales" },
                                        { v: "recomendacion", t: "Recomendación" },
                                        { v: "sitio", t: "Sitio web" },
                                        { v: "publicidad", t: "Publicidad" },
                                        { v: "otro", t: "Otro" },
                                    ].map(({ v, t }, i) => {
                                        const letter = String.fromCharCode(65 + i); // A, B, C, D, E
                                        return (
                                            <label key={v} className={radioCard}>
                                                {/* input oculto pero accesible (peer) */}
                                                <input
                                                    type="radio"
                                                    value={v}
                                                    {...register("comoNosConociste")}
                                                    className={radioHidden}
                                                />

                                                {/* badge con la letra */}
                                                <span className={radioBadge} aria-hidden="true">{letter}</span>

                                                <span>{t}</span>
                                            </label>
                                        );
                                    })}
                                </div>

                                {/* {uxError && <p className="text-yellow-400 text-sm">{uxError}</p>} */}
                                {uxError && <p className="text-red-400 text-sm">{uxError}</p>}
                            </div>
                        )}

                        {steps[currentStep].type === "submit" && (
                            <div className="space-y-4">
                                <div className="rounded-xl bg-gray-850/40 p-4 text-sm text-gray-200">
                                    <div><b>Personas:</b> {adultos14} de 14+ y {menores14} menores (total {totalPersonas}).</div>
                                    <div><b>Movilidad reducida:</b> {movilidadReducida}</div>
                                    <div><b>Alergias:</b> {alergias === "si" ? "Sí" : "No"}</div>
                                    {origenVisita && <div><b>Origen:</b> {origenVisita}</div>}
                                    {comoNosConociste && <div><b>Cómo nos conociste:</b> {comoNosConociste}</div>}
                                </div>

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
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg border border-white/80 text-white hover:bg-white hover:text-gray-900 transition"
                                >
                                    Anterior
                                </button>
                            )}

                            <div className="ml-auto">
                                {currentStep < steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={guardedNext}
                                        className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-white text-gray-900 hover:opacity-90 transition"
                                    >
                                        Siguiente
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={!aceptaReglas || submitting}
                                        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-white text-gray-900 transition
                      ${(!aceptaReglas || submitting) ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}
                                    >
                                        {submitting ? "Enviando..." : "Enviar"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </form>
        </div>
    );
}
