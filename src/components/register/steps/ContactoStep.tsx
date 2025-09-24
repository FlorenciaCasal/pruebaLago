import { inputBase } from "@/styles/ui";
import type { UseFormRegister } from "react-hook-form";
import type { ReservationFormData } from "@/types/reservation";

export default function ContactoStep({
    register,
    uxError,
}: {
    register: UseFormRegister<ReservationFormData>;
    uxError: string | null;
}) {
    return (
        <div className="space-y-4 rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="grid sm:grid-cols-2 gap-3">
                <div>
                    <label className="block mb-1">Nombre</label>
                    <input
                        {...register("nombre", { setValueAs: v => String(v ?? "").trim() })}
                        className={inputBase}
                        inputMode="text"
                        autoComplete="given-name"
                        maxLength={60}
                    />
                </div>
                <div>
                    <label className="block mb-1">Apellido</label>
                    <input
                        {...register("apellido", { setValueAs: v => String(v ?? "").trim() })}
                        className={inputBase}
                        inputMode="text"
                        autoComplete="family-name"
                        maxLength={60}
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
                <div>
                    <label className="block mb-1">DNI</label>
                    <input
                        {...register("dni", {
                            setValueAs: v => String(v ?? "").replace(/\D+/g, "").slice(0, 8), // 👈 filtra y limita
                        })}
                        className={inputBase}
                        inputMode="numeric"
                        pattern="^[0-9]{8}$"     // 👈 ayuda al browser
                        maxLength={8}
                    />
                </div>
                <div>
                    <label className="block mb-1">Email</label>
                    <input
                        {...register("correo", { setValueAs: v => String(v ?? "").trim() })}
                        className={inputBase}
                        type="email"
                        autoComplete="email"
                        maxLength={120}
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
                <div>
                    <label className="block mb-1">Teléfono</label>
                    <input
                        {...register("telefono", { setValueAs: v => String(v ?? "").trim() })}
                        className={inputBase}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="block mb-1">¿Desde dónde nos visitás?</label>
                    <input
                        {...register("origenVisita", {
                            setValueAs: v => String(v ?? "").replace(/\d+/g, "").trim(),   // 👈 quita números
                        })}
                        className={inputBase}
                        placeholder="Ej. Córdoba, AR"
                        inputMode="text"
                        maxLength={80}
                    />
                </div>
            </div>

            {uxError && <p className="text-red-400 text-sm">{uxError}</p>}
        </div>
    );
}
