"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const POLICIES_URL = "/politicas-de-visita"; // 👈 cambiá por tu ruta real

type ComoNosConociste = "redes" | "recomendacion" | "sitio" | "publicidad" | "otro";

type ReservationFormData = {
    // Datos personales
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    correo: string;

    // Contadores
    adultos14: number;         // 14+ (incluye al titular)
    menores14: number;         // <14
    movilidadReducida: number; // de las personas ingresadas

    // Alergias / comentarios
    alergias: "si" | "no";
    detalleAlergias?: string;
    comentarios?: string;

    // Nuevos
    origenVisita: string;
    comoNosConociste: ComoNosConociste | "";

    // Reglas
    aceptaReglas: boolean;
};

interface RegistroProps {
    fechaSeleccionada: Date | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL; // dejalo vacío si no hay backend aún
const MOCK_SUBMIT = !API_URL; // si no hay URL, mockeamos

const lineColor = "border-white/80";
const textMain = "text-white";
const textSoft = "text-white/70";
const accentBg = "bg-white";
const accentText = "text-gray-900";

const inputBase =
    `w-full bg-transparent ${textMain} placeholder:${textSoft}
   border-0 border-b ${lineColor} focus:border-b-2
   outline-none focus:outline-none ring-0 focus:ring-0
   py-3 transition`;

const textareaBase =
    `w-full bg-transparent ${textMain} placeholder:${textSoft}
   border ${lineColor} border-t-0 border-l-0 border-r-0
   focus:border-b-2 outline-none ring-0 focus:ring-0
   py-3 transition`;

const textareaBase2 =
    `w-full bg-transparent ${textMain} placeholder:${textSoft}
   border ${lineColor} border-t-0 border-l-0 border-r-0
   focus:border-b-2 outline-none ring-0 focus:ring-0 px-4
   py-3 transition`;

const sectionRow = "py-3 border-b border-white/10"; // separador sutil
const hintText = "text-sm " + textSoft;

const buttonPrimary =
    `inline-flex items-center justify-center rounded-md
   px-5 py-2 font-medium ${accentBg} ${accentText}
   hover:opacity-90 active:opacity-80 transition`;

const radioDot =
    `appearance-none w-4 h-4 rounded-full border ${lineColor}
   checked:bg-cream checked:shadow-[inset_0_0_0_3px_rgba(17,24,39,1)] 
   // alt para sin cream: checked:bg-white checked:shadow-[inset_0_0_0_3px_rgba(17,24,39,1)]
  `;

const checkboxBox =
    `appearance-none w-4 h-4 rounded-sm border ${lineColor}
   checked:bg-cream checked:shadow-[inset_0_0_0_2px_rgba(17,24,39,1)]
  `;

export default function Formulario({ fechaSeleccionada }: RegistroProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [uxError, setUxError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);


    const { register, watch, setValue, handleSubmit } = useForm<ReservationFormData>({
        defaultValues: {
            nombre: "",
            apellido: "",
            dni: "",
            telefono: "",
            correo: "",
            adultos14: 1,
            menores14: 0,
            movilidadReducida: 0,
            alergias: "no",
            detalleAlergias: "",
            comentarios: "",
            origenVisita: "",
            comoNosConociste: "",
            aceptaReglas: false,
        },
    });

    const aceptaReglas = watch("aceptaReglas") ?? false;
    const alergias = watch("alergias");
    const adultos14 = Math.max(1, watch("adultos14") ?? 1);
    const menores14 = Math.max(0, watch("menores14") ?? 0);
    const movilidadReducida = Math.max(0, watch("movilidadReducida") ?? 0);
    const totalPersonas = adultos14 + menores14;

    const comoNosConociste = watch("comoNosConociste");
    const origenVisita = (watch("origenVisita") ?? "").trim();

    // --- Steps ---
    const steps = [
        { label: "Completá tus datos personales", type: "text" as const },
        { label: "¿Cuántas personas son?", type: "group" as const },
        { label: "¿Desde dónde nos visitás?", type: "origen" as const },
        { label: "¿Cómo te enteraste de nuestra existencia?", type: "conociste" as const },
        { label: "Revisión y envío", type: "submit" as const },
    ];

    const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

    // --- Counters (Airbnb-like) ---
    const Counter = ({
        label,
        value,
        onChange,
        min = 0,
        max = Infinity,
        description,
        disableMinusWhenMin = false,
    }: {
        label: string;
        value: number;
        onChange: (next: number) => void;
        min?: number;
        max?: number;
        description?: string;
        disableMinusWhenMin?: boolean;
    }) => {
        const dec = () => onChange(Math.max(min, value - 1));
        const inc = () => onChange(Math.min(max, value + 1));
        return (
            // Wrapper del item del contador
            <div className={`flex items-center justify-between ${sectionRow}`}>
                <div>
                    <p className="font-medium">{label}</p>
                    {description ? <p className={hintText}>{description}</p> : null}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={dec}
                        disabled={disableMinusWhenMin && value <= min}
                        className={`h-10 w-10 grid place-items-center rounded-full border ${lineColor}
                  ${textMain} disabled:opacity-50`}
                        aria-label={`Disminuir ${label}`}
                    >
                        –
                    </button>
                    <span className="w-8 text-center">{value}</span>
                    <button
                        type="button"
                        onClick={inc}
                        disabled={value >= max}
                        className={`h-10 w-10 grid place-items-center rounded-full border ${lineColor}
                  ${textMain} disabled:opacity-50`}
                        aria-label={`Aumentar ${label}`}
                    >
                        +
                    </button>
                </div>
            </div>
        );
    };

    // --- Validaciones por step ---
    const validateGroup = () => {
        setUxError(null);
        if (adultos14 < 1) {
            setUxError("Debe haber al menos 1 persona de 14 años o más (te incluimos a vos).");
            return false;
        }
        if (movilidadReducida > totalPersonas) {
            setUxError("La cantidad con movilidad reducida no puede superar el total de personas.");
            return false;
        }
        return true;
    };

    const validateOrigen = () => {
        if (!origenVisita) {
            setUxError("Por favor, contanos desde dónde nos visitás.");
            return false;
        }
        setUxError(null);
        return true;
    };

    const validateConociste = () => {
        if (!comoNosConociste) {
            setUxError("Elegí una opción sobre cómo nos conociste.");
            return false;
        }
        setUxError(null);
        return true;
    };

    const guardedNext = () => {
        const t = steps[currentStep].type;
        if (t === "group" && !validateGroup()) return;
        if (t === "origen" && !validateOrigen()) return;
        if (t === "conociste" && !validateConociste()) return;
        nextStep();
    };

    // --- Submit ---
    const onSubmit: SubmitHandler<ReservationFormData> = async (data) => {
        // última validación defensiva
        if (!validateGroup() || !validateOrigen() || !validateConociste()) return;

        setServerError(null);
        setSuccessMsg(null);
        setSubmitting(true);
        try {
            if (!fechaSeleccionada) throw new Error("No hay fecha seleccionada");

            const payload = {
                ...data,
                totalPersonas,
                reservationDate: fechaSeleccionada.toISOString().split("T")[0],
            };

            //   // TODO: reemplazar por tu endpoint real
            //   const res = await fetch("http://localhost:8080/api/reservations", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(payload),
            //   });

            if (MOCK_SUBMIT) {
                // Simulación de latencia
                await new Promise((r) => setTimeout(r, 700));
                setSuccessMsg("¡Reserva realizada con éxito!");
                return;
            }

            const res = await fetch(`${API_URL}/api/reservations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Error creando reserva");

            // ✅ Éxito: mostramos pantalla final con recomendaciones y recordatorio
            setSuccessMsg("¡Reserva realizada con éxito!");
        } catch (e: any) {
            console.error(e);
            setServerError(e?.message || "Error inesperado");
        } finally {
            setSubmitting(false); // 👈 termina envío
        }
    };

    // --- Handlers reglas para counters ---
    const setAdultos = (next: number) => {
        const safe = Math.max(1, next || 1);
        setValue("adultos14", safe, { shouldDirty: true });
        const newTotal = safe + menores14;
        if (movilidadReducida > newTotal) {
            setValue("movilidadReducida", newTotal, { shouldDirty: true });
        }
    };
    const setMenores = (next: number) => {
        const safe = Math.max(0, next || 0);
        setValue("menores14", safe, { shouldDirty: true });
        const newTotal = adultos14 + safe;
        if (movilidadReducida > newTotal) {
            setValue("movilidadReducida", newTotal, { shouldDirty: true });
        }
    };
    const setMovilidad = (next: number) => {
        const max = totalPersonas;
        const safe = Math.min(Math.max(0, next || 0), max);
        setValue("movilidadReducida", safe, { shouldDirty: true });
    };

    // --- Pantalla de éxito (post-submit) ---
    if (successMsg) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
                <div className="w-full max-w-xl">
                    <div className="mb-4 rounded-lg bg-green-600/20 border border-green-600 px-4 py-3">
                        <h2 className="text-xl font-semibold">{successMsg}</h2>
                        <p className="mt-1 text-sm text-gray-200">
                            Te enviaremos un recordatorio <b>48 horas antes</b> para confirmar tu llegada.
                            Recordá llegar <b>15 minutos antes</b> del horario indicado. ¡Nos vemos pronto! ✨
                        </p>
                    </div>

                    <div className="rounded-2xl bg-gray-950/40 p-5 space-y-3">
                        <h3 className="text-lg font-semibold">Antes de tu visita</h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-200">
                            <li>No se permiten mascotas.</li>
                            <li>Traé ropa cómoda.</li>
                            <li>Botella recargable de agua.</li>
                            <li>Gorro y protector solar.</li>
                            <li>No contamos con servicio de venta de alimentos.</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // --- Form con steps ---
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl text-left px-6 py-10 text-white">
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
                        {/* Encabezado */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xl font-medium">{currentStep + 2}</span>
                            <ArrowRight className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">{steps[currentStep].label}</h2>
                        </div>


                        {/* Paso 1: Datos personales */}
                        {steps[currentStep].type === "text" && (
                            <div className="space-y-3">
                                <input {...register("nombre")} placeholder="Nombre" className={inputBase} />
                                <input {...register("apellido")} placeholder="Apellido" className={inputBase} />
                                <input {...register("dni")} placeholder="DNI" className={inputBase} />
                                <input {...register("telefono")} placeholder="Teléfono" className={inputBase} />
                                <input {...register("correo")} placeholder="Correo" className={inputBase} />
                            </div>
                        )}

                        {/* Paso 2: ¿Cuántas personas son? */}
                        {steps[currentStep].type === "group" && (
                            <div className="space-y-6">
                                <div className="rounded-2xl  p-4">
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
                                </div>

                                {/* <div className="text-sm text-gray-300">
                  Total: <span className="font-semibold text-white">{totalPersonas}</span>
                </div> */}

                                <div className="rounded-2xl p-4">
                                    <Counter
                                        label="De las personas que ingresaste, ¿cuántas tienen movilidad reducida?"
                                        value={movilidadReducida}
                                        onChange={setMovilidad}
                                        min={0}
                                        max={totalPersonas}
                                    // description="No puede superar el total."
                                    />
                                </div>

                                {uxError && (
                                    <div className="rounded-lg bg-yellow-600/20 border border-yellow-600 px-3 py-2 text-sm">
                                        {uxError}
                                    </div>
                                )}

                                {/* Alergias */}
                                <div className="mt-2 p-4">
                                    <p className="font-semibold mb-2">¿Alguno de los acompañantes es alérgico?</p>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value="no" {...register("alergias")} className={radioDot} defaultChecked />
                                            <span>No</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value="si" {...register("alergias")} className={radioDot} />
                                            <span>Sí</span>
                                        </label>
                                    </div>


                                    {alergias === "si" && (
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
                                    <label className="block p-4 font-semibold">
                                        ¿Querés agregar algún comentario o algo que debamos saber?
                                    </label>
                                    <textarea
                                        {...register("comentarios")}
                                        placeholder="Ej: una persona se marea fácil; llegamos con cochecito; necesitamos ayuda al llegar..."
                                        className={textareaBase2}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Paso 3: Desde dónde nos visitás */}
                        {steps[currentStep].type === "origen" && (
                            <div className="space-y-3">
                                <textarea
                                    {...register("origenVisita")}
                                    placeholder="Contanos desde dónde nos visitás (ciudad, provincia/país)."
                                    className={textareaBase}
                                    rows={3}
                                />
                                {uxError && <p className="text-yellow-400 text-sm">{uxError}</p>}
                            </div>
                        )}

                        {/* Paso 4: ¿Cómo nos conociste? */}
                        {steps[currentStep].type === "conociste" && (
                            <div className="space-y-3">
                                <div className="grid gap-3">
                                    {[
                                        { v: "redes", t: "Redes sociales" },
                                        { v: "recomendacion", t: "Recomendación" },
                                        { v: "sitio", t: "Sitio web" },
                                        { v: "publicidad", t: "Publicidad" },
                                        { v: "otro", t: "Otro" },
                                    ].map(({ v, t }) => (
                                        <label key={v} className="flex items-center gap-3 cursor-pointer">
                                            <input type="radio" value={v} {...register("comoNosConociste")} className={radioDot} />
                                            <span>{t}</span>
                                        </label>
                                    ))}
                                </div>

                                {uxError && <p className="text-yellow-400 text-sm">{uxError}</p>}
                            </div>
                        )}

                        {/* Paso 5: Revisión y envío */}
                        {steps[currentStep].type === "submit" && (
                            <div className="space-y-4">
                                {/* Mini resumen opcional */}
                                <div className="rounded-xl bg-gray-950/40 p-4 text-sm text-gray-200">
                                    <div><b>Personas:</b> {adultos14} de 14+ y {menores14} menores (total {totalPersonas}).</div>
                                    <div><b>Movilidad reducida:</b> {movilidadReducida}</div>
                                    <div><b>Alergias:</b> {alergias === "si" ? "Sí" : "No"}</div>
                                    {origenVisita && <div><b>Origen:</b> {origenVisita}</div>}
                                    {comoNosConociste && <div><b>Cómo nos conociste:</b> {comoNosConociste}</div>}
                                </div>

                                {/* Aceptación de políticas (letra chica + link) */}
                                <label className={`flex items-start gap-3 text-xs ${textSoft} cursor-pointer select-none`}>
                                    <input
                                        type="checkbox"
                                        {...register("aceptaReglas")}
                                        className="mt-0.5 w-4 h-4 cursor-pointer appearance-none border border-white/80 rounded-sm
               checked:bg-white checked:shadow-[inset_0_0_0_2px_rgba(17,24,39,1)]"
                                    />
                                    <span>
                                        Acepto las{" "}
                                        <a href={POLICIES_URL} target="_blank" className="underline hover:opacity-90 text-white">
                                            políticas de visita
                                        </a>{" "}
                                        (derecho de admisión y manejo de datos).
                                    </span>
                                </label>

                            </div>
                        )}

                        {/* Navegación */}
                        <div className="mt-10 flex items-center gap-3">
                            {currentStep > 0 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 rounded-full border border-white/80 text-white hover:bg-white hover:text-gray-900 transition"
                                >
                                    Anterior
                                </button>
                            )}

                            <div className="ml-auto">
                                {currentStep < steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={guardedNext}
                                        className="px-6 py-3 rounded-full bg-white text-gray-900 hover:opacity-90 transition"
                                    >
                                        Siguiente
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={!aceptaReglas || submitting}
                                        className={`px-6 py-3 rounded-full bg-white text-gray-900 transition
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
