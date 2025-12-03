import { inputBase } from "@/styles/ui";
import type { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import type { ReservationFormData } from "@/types/reservation";
import CityAutocomplete from "@/components/forms/CityAutocomplete";

export default function InstitucionStep({
    register,
    watch,
    setValue,
    uxError,
}: {
    register: UseFormRegister<ReservationFormData>;
    watch: UseFormWatch<ReservationFormData>;
    setValue: UseFormSetValue<ReservationFormData>;
    uxError: string | null;
}) {
    return (
        <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
                <input {...register("institucion")} placeholder="Nombre de la institución" className={inputBase} />
                {/* <input {...register("institucionLocalidad")} placeholder="Localidad" className={inputBase} /> */}
                <CityAutocomplete
                    value={watch("institucionLocalidad") || ""}
                    onChange={(value) => setValue("institucionLocalidad", value, { shouldDirty: true })}
                    placeholder="Localidad"
                    className={inputBase}
                />

                <input {...register("institucionEmail")} placeholder="Email" className={inputBase} />
                <input {...register("institucionTelefono")} placeholder="Teléfono" className={inputBase} />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
                <input {...register("responsableNombre")} placeholder="Nombre (responsable)" className={inputBase} />
                <input {...register("responsableApellido")} placeholder="Apellido (responsable)" className={inputBase} />
                <input {...register("responsableDni")} placeholder="DNI (responsable)" className={inputBase} />
            </div>

            <label className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm font-medium">
                    ¿El responsable asistirá a la visita?
                </span>
                <div className="relative w-11 h-6">
                    {/* checkbox real, oculto pero sigue recibiendo el click por estar dentro del label */}
                    <input
                        type="checkbox"
                        {...register("reservaAsiste")}
                        defaultChecked
                        className="peer sr-only"
                    />
                    {/* pista del switch */}
                    <div
                        className="w-11 h-6 rounded-full bg-gray-300 peer-checked:bg-button transition-colors duration-200 cursor-pointer"
                    />
                    {/* bolita */}
                    <div
                        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 peer-checked:translate-x-5"
                    />
                </div>
            </label>

            {uxError && <p className="text-red-400 text-sm">{uxError}</p>}
        </div>
    );
}
