"use client";
import * as React from "react";
import { getAdminBookingFlags, setAdminBookingFlags, type BookingFlags } from "@/services/admin";

export default function BookingFlagsInline() {
    const [flags, setFlags] = React.useState<BookingFlags | null>(null);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    function getErrorMessage(err: unknown, fallback: string): string {
        if (err instanceof Error) return err.message;
        try {
            const j = err as { message?: string };
            if (j?.message) return j.message;
        } catch { }
        return fallback;
    }

    React.useEffect(() => {
        getAdminBookingFlags()
            .then(f => setFlags({
                individualEnabled: f.individualEnabled ?? true,
                schoolEnabled: !!f.schoolEnabled
            }))
            //         .catch(e => setError(e?.message ?? "No se pudo leer configuración"));
            // }, []);
            .catch((e: unknown) => setError(getErrorMessage(e, "No se pudo leer configuración")));
    }, []);


    if (error) {
        return (
            <div className="text-xs text-red-400 border border-red-900/40 bg-red-950/30 rounded-lg px-2 py-1.5">
                {error}
            </div>
        );
    }
    if (!flags) {
        return (
            <div className="text-xs text-neutral-400 border border-neutral-800 bg-neutral-900/60 rounded-lg px-2 py-1.5">
                Cargando opciones…
            </div>
        );
    }

    // solo se puede togglear escuela (particular siempre habilitado por ahora)
    const schoolEnabled = flags.schoolEnabled;

    // Siempre enviamos AMBOS flags al backend
    async function toggleSchool(nextValue: boolean) {
        setSaving(true);
        setError(null);
        try {
            setFlags(prev => {
                const safe: BookingFlags = {
                    individualEnabled: prev?.individualEnabled ?? true, // por ahora particular siempre on
                    schoolEnabled: nextValue,
                };
                return safe;
            });

            const payload: BookingFlags = {
                individualEnabled: true,    // si más adelante agregás el toggle de particular, reemplazá esto por prev?.individualEnabled
                schoolEnabled: nextValue,
            };
            await setAdminBookingFlags(payload);
        } catch (e: unknown) {
            setError(getErrorMessage(e, "No se pudo guardar"));
            setFlags(prev => (prev ? { ...prev, schoolEnabled: !nextValue } : prev));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex items-center gap-3">
            {/* “Particular” a modo informativo */}
            {/* <span className="text-xs text-neutral-400 hidden md:inline">
                Particular: <span className="text-neutral-200">Habilitado</span>
            </span> */}

            {/* Toggle de institución educativa */}
            <label className="flex items-center gap-2 select-none">
                <span className="text-sm text-neutral-300">Institución educativa</span>
                <button
                    type="button"
                    onClick={() => toggleSchool(!schoolEnabled)}
                    disabled={saving}
                    aria-pressed={schoolEnabled}
                    className={
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors " +
                        (schoolEnabled ? "bg-green-600/80 hover:bg-green-600" : "bg-neutral-700 hover:bg-neutral-600") +
                        (saving ? " opacity-70 cursor-wait" : "")
                    }
                    title={schoolEnabled ? "Deshabilitar reservas escolares" : "Habilitar reservas escolares"}
                >
                    <span
                        className={
                            "inline-block h-5 w-5 transform rounded-full bg-white transition-transform " +
                            (schoolEnabled ? "translate-x-5" : "translate-x-1")
                        }
                    />
                </button>
                <span className="text-xs text-neutral-400">
                    {saving ? "Guardando…" : schoolEnabled ? "Habilitadas" : "Deshabilitadas"}
                </span>
            </label>
        </div>
    );
}
